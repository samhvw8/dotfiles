#!/usr/bin/env node
/**
 * CCS WebSearch Hook - CLI Tool Executor with Fallback Chain
 *
 * Intercepts Claude's WebSearch tool and executes search via CLI tools.
 * Respects provider enabled states from config.yaml.
 * Supports automatic fallback: Gemini CLI → OpenCode → Grok CLI
 *
 * Environment Variables (set by CCS):
 *   P_WEBSEARCH_SKIP=1           - Skip this hook entirely (for official Claude)
 *   P_WEBSEARCH_ENABLED=1        - Enable WebSearch (default: 1)
 *   P_WEBSEARCH_TIMEOUT=55       - Timeout in seconds (default: 55)
 *   P_WEBSEARCH_GEMINI=1         - Enable Gemini CLI provider
 *   P_WEBSEARCH_GEMINI_MODEL     - Gemini model (default: gemini-2.5-flash)
 *   P_WEBSEARCH_OPENCODE=1       - Enable OpenCode provider
 *   P_WEBSEARCH_OPENCODE_MODEL   - OpenCode model (default: opencode/grok-code)
 *   P_WEBSEARCH_GROK=1           - Enable Grok CLI provider
 *   P_WEBSEARCH_RETRIES=2        - Max retries per provider (default: 2)
 *   P_DEBUG=1                    - Enable debug output
 *
 * Exit codes:
 *   0 - Allow tool (pass-through to native WebSearch)
 *   2 - Block tool (deny with results/message)
 *
 * @module hooks/websearch-transformer
 */

const { spawnSync } = require('child_process');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  minResponseLength: 20,
  defaultTimeoutSec: 60,
  defaultRetries: 1,
  defaultProvider: 'gemini',
};

/**
 * SHARED INSTRUCTIONS - Fast link retrieval only
 */
const SHARED_INSTRUCTIONS = `Today: ${new Date().toISOString().slice(0, 10)}

Run exactly 1 search. Return the top 10 most relevant results. For each result, output ONLY:
[N] Title
    URL: https://...

Do NOT fetch pages. Do NOT summarize. Do NOT add commentary. Do NOT run multiple searches. Just the ranked list.`;

/**
 * UNIFIED PROVIDER DEFINITIONS
 * Each provider defines: command, args builder, model env override, and quirks
 */
const PROVIDERS = {
  gemini: {
    name: 'Gemini CLI',
    cmd: 'gemini',
    defaultModel: 'gemini-3-flash-preview', // gemini-2.5-flash or gemini-3-flash-preview 
    modelEnvVar: 'P_WEBSEARCH_GEMINI_MODEL',
    toolInstruction: 'Call google_web_search exactly ONCE with the query. Do NOT make multiple searches.',
    quirks: null,
    buildArgs: (prompt, model) => ['--model', model, '--yolo', '-p', prompt],
    errorPatterns: ['error:', 'failed to', 'authentication required'],
  },
  opencode: {
    name: 'OpenCode',
    cmd: 'opencode',
    defaultModel: 'opencode/grok-code',
    modelEnvVar: 'P_WEBSEARCH_OPENCODE_MODEL',
    toolInstruction: 'Search the web exactly ONCE. Do NOT make multiple searches.',
    quirks: null,
    buildArgs: (prompt, model) => ['run', prompt, '--model', model],
    errorPatterns: ['error:', 'failed to', 'authentication required'],
  },
  grok: {
    name: 'Grok CLI',
    cmd: 'grok',
    defaultModel: 'grok-3',
    modelEnvVar: null,
    toolInstruction: 'Search the web exactly ONCE. Do NOT make multiple searches.',
    quirks: 'For breaking news or real-time events, also check X/Twitter if relevant.',
    buildArgs: (prompt) => [prompt],
    errorPatterns: ['error:', 'failed to', 'api key'],
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

const debug = (...args) => {
  if (process.env.P_DEBUG === '1') {
    console.error('[P Hook]', ...args);
  }
};

/**
 * Check if a CLI tool is available
 */
function isCliAvailable(cmd) {
  try {
    const whichCmd = process.platform === 'win32' ? 'where.exe' : 'which';
    const result = spawnSync(whichCmd, [cmd], {
      encoding: 'utf8',
      timeout: 2000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.status === 0 && result.stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Check if provider is enabled via environment variable
 */
function isProviderEnabled(providerId) {
  return process.env[`P_WEBSEARCH_${providerId.toUpperCase()}`] === '1';
}

/**
 * Build the complete prompt for a provider
 */
function buildPrompt(providerId, query) {
  const provider = PROVIDERS[providerId];
  const parts = [
    `Search the web for: ${query}`,
    '',
    provider.toolInstruction,
    '',
    SHARED_INSTRUCTIONS,
  ];

  if (provider.quirks) {
    parts.push('', `Note: ${provider.quirks}`);
  }

  return parts.join('\n');
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // Busy wait (no async in this context)
  }
}

// ============================================================================
// PROVIDER EXECUTION
// ============================================================================

/**
 * Execute search via any provider (generic executor)
 */
function executeProvider(providerId, query, timeoutSec) {
  const provider = PROVIDERS[providerId];
  const timeoutMs = timeoutSec * 1000;
  const prompt = buildPrompt(providerId, query);

  const model = provider.modelEnvVar
    ? process.env[provider.modelEnvVar] || provider.defaultModel
    : provider.defaultModel;

  const args = provider.buildArgs(prompt, model);

  debug(`Executing: ${provider.cmd} ${args.slice(0, 2).join(' ')}...`);

  try {
    const result = spawnSync(provider.cmd, args, {
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 1024 * 1024 * 2,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (result.error) {
      if (result.error.code === 'ENOENT') {
        return { success: false, error: `${provider.name} not installed`, retryable: false };
      }
      if (result.error.killed) {
        return { success: false, error: `${provider.name} timed out`, retryable: true };
      }
      return { success: false, error: result.error.message, retryable: true };
    }

    if (result.status !== 0) {
      const stderr = (result.stderr || '').trim();
      return {
        success: false,
        error: stderr || `${provider.name} exited with code ${result.status}`,
        retryable: result.status !== 1,
      };
    }

    const output = (result.stdout || '').trim();

    if (!output || output.length < CONFIG.minResponseLength) {
      return { success: false, error: 'Empty or too short response', retryable: true };
    }

    const lowerOutput = output.toLowerCase();
    for (const pattern of provider.errorPatterns) {
      if (lowerOutput.includes(pattern)) {
        return {
          success: false,
          error: `${provider.name} returned error: ${output.substring(0, 100)}`,
          retryable: false,
        };
      }
    }

    return { success: true, content: output };
  } catch (err) {
    return { success: false, error: err.message || 'Unknown error', retryable: true };
  }
}

/**
 * Execute provider with retries
 */
function executeProviderWithRetry(providerId, query, timeoutSec) {
  const maxRetries = parseInt(process.env.P_WEBSEARCH_RETRIES || CONFIG.defaultRetries, 10);
  const provider = PROVIDERS[providerId];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    debug(`${provider.name} attempt ${attempt}/${maxRetries}`);

    const result = executeProvider(providerId, query, timeoutSec);

    if (result.success) {
      return result;
    }

    if (!result.retryable || attempt === maxRetries) {
      return result;
    }

    const backoffMs = 500 * Math.pow(2, attempt - 1);
    debug(`Retrying in ${backoffMs}ms...`);
    sleep(backoffMs);
  }

  return { success: false, error: 'Max retries exceeded' };
}

// ============================================================================
// HOOK LOGIC
// ============================================================================

/**
 * Determine if hook should skip and pass through to native WebSearch
 */
function shouldSkipHook() {
  if (process.env.P_WEBSEARCH_SKIP === '1') return true;

  const profileType = process.env.P_PROFILE_TYPE;
  if (profileType === 'account' || profileType === 'default') return true;

  if (process.env.P_WEBSEARCH_ENABLED === '0') return true;

  return false;
}

/**
 * Format search results for Claude
 */
function formatSearchResults(query, content, providerName) {
  return [
    `[WebSearch via ${providerName}] Query: "${query}"`,
    '',
    content,
  ].join('\n');
}

/**
 * Output success response and exit
 */
function outputSuccess(query, content, providerName) {
  const formattedResults = formatSearchResults(query, content, providerName);

  const output = {
    decision: 'block',
    reason: `WebSearch completed via ${providerName}`,
    systemMessage: `[WebSearch via ${providerName}] Results retrieved successfully.`,
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: formattedResults,
    },
  };

  console.log(JSON.stringify(output));
  process.exit(2);
}

/**
 * Output all providers failed message
 */
function outputAllFailedMessage(query, errors) {
  const errorDetails = errors.map((e) => `  - ${e.provider}: ${e.error}`).join('\n');

  const message = [
    '[WebSearch - All Providers Failed]',
    '',
    'Tried all enabled CLI tools but all failed:',
    errorDetails,
    '',
    `Query: "${query}"`,
    '',
    'Troubleshooting:',
    '  - Gemini: run `gemini` to authenticate (opens browser)',
    '  - OpenCode: opencode --version',
    '  - Grok: Check XAI_API_KEY environment variable',
  ].join('\n');

  const output = {
    decision: 'block',
    reason: 'WebSearch failed - all providers failed',
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: message,
    },
  };

  console.log(JSON.stringify(output));
  process.exit(2);
}

/**
 * Main hook processing logic with fallback chain
 */
async function processHook() {
  try {
    if (shouldSkipHook()) {
      process.exit(0);
    }

    const data = JSON.parse(input);

    if (data.tool_name !== 'WebSearch') {
      process.exit(0);
    }

    const query = data.tool_input?.query?.trim();
    if (!query) {
      process.exit(0);
    }

    const timeout = parseInt(process.env.P_WEBSEARCH_TIMEOUT || CONFIG.defaultTimeoutSec, 10);
    const enabledProviders = Object.entries(PROVIDERS)
      .filter(([id]) => {
        const enabled = isProviderEnabled(id);
        const available = isCliAvailable(PROVIDERS[id].cmd);
        debug(`${PROVIDERS[id].name}: enabled=${enabled}, available=${available}`);
        return enabled && available;
      })
      .map(([id, provider]) => ({ id, ...provider }));

    if (enabledProviders.length === 0) {
      // No providers explicitly enabled - use default provider if available
      const defaultId = CONFIG.defaultProvider;
      const defaultProvider = PROVIDERS[defaultId];

      if (defaultProvider && isCliAvailable(defaultProvider.cmd)) {
        debug(`No providers enabled - using default: ${defaultProvider.name}`);
        enabledProviders.push({ id: defaultId, ...defaultProvider });
      } else {
        debug('No providers enabled and default unavailable - passing through to native WebSearch');
        process.exit(0);
      }
    }

    debug(`Enabled providers: ${enabledProviders.map((p) => p.name).join(', ')}`);

    const errors = [];

    for (const provider of enabledProviders) {
      debug(`Trying ${provider.name}...`);

      const result = executeProviderWithRetry(provider.id, query, timeout);

      if (result.success) {
        outputSuccess(query, result.content, provider.name);
        return;
      }

      debug(`${provider.name} failed: ${result.error}`);
      errors.push({ provider: provider.name, error: result.error });
    }

    outputAllFailedMessage(query, errors);
  } catch (err) {
    debug('Parse error:', err.message);
    process.exit(0);
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', processHook);
process.stdin.on('error', () => process.exit(0));
