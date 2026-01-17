#!/usr/bin/env node
/**
 * Smart Delegation Finder
 * Extracts agent/skill metadata and uses Claude to find best matches for user task
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Debug logging via env var
const DEBUG = process.env.DELEGATION_DEBUG === '1';

function log(message, data = null) {
    if (!DEBUG) return;
    console.error(`[Delegation] ${message}${data ? ': ' + JSON.stringify(data) : ''}`);
}

// Global (home) directories
const HOME_CLAUDE_DIR = path.join(process.env.HOME, '.claude');
const HOME_AGENTS_DIR = path.join(HOME_CLAUDE_DIR, 'agents');
const HOME_SKILLS_DIR = path.join(HOME_CLAUDE_DIR, 'skills');

/**
 * Get project directories based on cwd from hook input
 */
function getProjectDirs(cwd) {
    const claudeDir = path.join(cwd, '.claude');
    return {
        claudeDir,
        agentsDir: path.join(claudeDir, 'agents'),
        skillsDir: path.join(claudeDir, 'skills'),
        pluginsDir: path.join(claudeDir, 'plugins', 'marketplaces')
    };
}

/**
 * Extract YAML frontmatter from a markdown file
 */
function extractFrontmatter(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) return null;

        const yaml = match[1];
        const nameMatch = yaml.match(/^name:\s*["']?([^"'\n]+)["']?/m);
        const descMatch = yaml.match(/^description:\s*["']?([\s\S]*?)(?=\n\w+:|$)/m);

        if (!nameMatch) return null;

        const name = nameMatch[1].trim();
        // Truncate description to 150 chars for efficiency
        let description = descMatch ? descMatch[1].trim() : '';
        // Clean up escaped newlines
        description = description.replace(/\\n/g, ' ').replace(/\s+/g, ' ');

        return { name, description };
    } catch (e) {
        log(`Error extracting frontmatter from ${filePath}`, e.message);
        return null;
    }
}

/**
 * Recursively find files matching a pattern
 */
function findFiles(dir, pattern, results = []) {
    if (!fs.existsSync(dir)) return results;

    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                findFiles(fullPath, pattern, results);
            } else if (pattern.test(entry.name)) {
                results.push(fullPath);
            }
        }
    } catch (e) {
        // Ignore permission errors
    }
    return results;
}

/**
 * Collect agents from a directory
 */
function collectAgentsFromDir(dir, agents, source) {
    if (!fs.existsSync(dir)) {
        log(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    log(`Found ${files.length} agent files in ${dir}`);

    for (const file of files) {
        const meta = extractFrontmatter(path.join(dir, file));
        if (meta) {
            // Project agents override global agents with same name
            const existingIdx = agents.findIndex(a => a.name === meta.name);
            if (existingIdx >= 0) {
                if (source === 'project') {
                    agents[existingIdx] = { ...meta, source };
                }
            } else {
                agents.push({ ...meta, source });
            }
        }
    }
}

/**
 * Collect agents from plugins directory
 */
function collectAgentsFromPlugins(pluginsDir, agents, source) {
    const pluginAgentFiles = findFiles(pluginsDir, /\.md$/);
    log(`Found ${pluginAgentFiles.length} md files in plugins`);

    for (const file of pluginAgentFiles) {
        if (file.includes('/agents/')) {
            const meta = extractFrontmatter(file);
            if (meta && !agents.some(a => a.name === meta.name)) {
                agents.push({ ...meta, source: source + '-plugin' });
            }
        }
    }
}

/**
 * Collect skills from a directory (recursively finds SKILL.md)
 */
function collectSkillsFromDir(dir, skills, source) {
    const skillFiles = findFiles(dir, /SKILL\.md$/);
    log(`Found ${skillFiles.length} SKILL.md files in ${dir}`);

    for (const file of skillFiles) {
        const meta = extractFrontmatter(file);
        if (meta) {
            // Project skills override global skills with same name
            const existingIdx = skills.findIndex(s => s.name === meta.name);
            if (existingIdx >= 0) {
                if (source === 'project') {
                    skills[existingIdx] = { ...meta, source };
                }
            } else {
                skills.push({ ...meta, source });
            }
        }
    }
}

/**
 * Collect skills from plugins directory
 */
function collectSkillsFromPlugins(pluginsDir, skills, source) {
    const pluginSkillFiles = findFiles(pluginsDir, /SKILL\.md$/);
    log(`Found ${pluginSkillFiles.length} SKILL.md files in plugins`);

    for (const file of pluginSkillFiles) {
        const meta = extractFrontmatter(file);
        if (meta && !skills.some(s => s.name === meta.name)) {
            skills.push({ ...meta, source: source + '-plugin' });
        }
    }
}

/**
 * Collect all agents and skills metadata from both global and project directories
 */
function collectMetadata(cwd) {
    const agents = [];
    const skills = [];
    const projectDirs = getProjectDirs(cwd);

    log('Starting metadata collection...');
    log(`HOME_CLAUDE_DIR: ${HOME_CLAUDE_DIR}`);
    log(`Project cwd: ${cwd}`);

    // 1. Collect from global (home) directories first
    collectAgentsFromDir(HOME_AGENTS_DIR, agents, 'global');
    collectSkillsFromDir(HOME_SKILLS_DIR, skills, 'global');

    // 2. Collect from project directories (overrides global with same name)
    // Only if project dir is different from home dir
    if (projectDirs.claudeDir !== HOME_CLAUDE_DIR) {
        log('Collecting from project directory...');
        collectAgentsFromDir(projectDirs.agentsDir, agents, 'project');
        collectAgentsFromPlugins(projectDirs.pluginsDir, agents, 'project');
        collectSkillsFromDir(projectDirs.skillsDir, skills, 'project');
        collectSkillsFromPlugins(projectDirs.pluginsDir, skills, 'project');
    }

    log(`Total collected: ${agents.length} agents, ${skills.length} skills`);
    return { agents, skills };
}

/**
 * Call Claude non-interactive to find best matches
 */
function findBestMatches(userPrompt, agents, skills) {
    const systemPrompt = `You are a task-to-capability matcher. Match user tasks to available agents and skills.

<instructions>
Tasks often have multiple subtasks. Match ALL relevant options:
- Break down task into subtasks if complex
- Match each subtask to best agent/skill
- Rank by relevance to primary intent

Return 3-5 agents and 3-5 skills, ranked. More matches = better coverage.
</instructions>

<output_format>
## Agents
1. **[name]** - [subtask/reason it covers]
2. **[name]** - [subtask/reason]
3. **[name]** - [subtask/reason]
[up to 5]

## Skills
1. **[name]** - [subtask/reason it covers]
2. **[name]** - [subtask/reason]
3. **[name]** - [subtask/reason]
[up to 5]

Return ONLY the above format. No explanations.
</output_format>`;

    const userMessage = `Task: "${userPrompt}"

<available>
AGENTS (autonomous delegation):
${agents.map(a => `• ${a.name}: ${a.description}`).join('\n')}

SKILLS (context enhancement - you execute):
${skills.map(s => `• ${s.name}: ${s.description}`).join('\n')}
</available>`;

    log(`System prompt length: ${systemPrompt.length} chars`);
    log(`User message length: ${userMessage.length} chars`);
    log('Calling Gemini...');

    try {
        const startTime = Date.now();

        // Build full prompt with system + user message
        const fullPrompt = `${systemPrompt}\n\n---\n\n${userMessage}`;

        const result = spawnSync('gemini', [
            '--model', 'gemini-3-flash-preview',
            '--yolo',
            '-p', fullPrompt
        ], {
            encoding: 'utf8',
            timeout: 30000,
            maxBuffer: 1024 * 1024,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        const elapsed = Date.now() - startTime;
        log(`Gemini call completed in ${elapsed}ms`);
        log(`Exit status: ${result.status}`);

        if (result.stderr) {
            log(`Stderr: ${result.stderr}`);
        }

        if (result.status !== 0) {
            log(`Claude call failed with status ${result.status}`);
            return `Error: Claude call failed (status: ${result.status}, signal: ${result.signal})`;
        }

        const output = result.stdout.trim();
        log(`Stdout length: ${output.length}`);
        log(`Stdout preview: ${output.slice(0, 200)}`);

        return output;
    } catch (e) {
        log(`Exception: ${e.message}`);
        return `Error: ${e.message}`;
    }
}

/**
 * Main execution
 */
async function main() {
    log('=== Delegation finder started ===');

    // Read input from stdin (hook passes JSON)
    let input = '';
    for await (const chunk of process.stdin) {
        input += chunk;
    }

    log(`Raw input length: ${input.length}`);
    log(`Raw input preview: ${input.slice(0, 200)}`);

    // Extract user prompt and cwd from hook input
    let userPrompt = '';
    let cwd = process.cwd(); // fallback
    try {
        const data = JSON.parse(input);
        log('Parsed input data', { keys: Object.keys(data) });
        userPrompt = data.message || data.prompt || '';
        cwd = data.cwd || data.workingDirectory || cwd;
    } catch (e) {
        log(`JSON parse failed: ${e.message}`);
        userPrompt = input.trim();
    }

    log(`User prompt: ${userPrompt.slice(0, 100)}`);
    log(`Working directory: ${cwd}`);

    if (!userPrompt) {
        userPrompt = 'General task';
    }

    // Collect metadata
    const { agents, skills } = collectMetadata(cwd);

    // Find best matches using Claude
    const matches = findBestMatches(userPrompt, agents, skills);

    log('Final matches', matches);

    // Output the delegation protocol
    console.log(`<delegation_protocol>
<analysis scanned="${agents.length} agents | ${skills.length} skills">
${matches}
</analysis>

<action_map>
| Match | Tool | Behavior |
|-------|------|----------|
| Agent fits | \`Task(subagent_type="X")\` | DELEGATE - agent works autonomously |
| Skill fits (no agent) | \`Skill("X")\` | ENHANCE - you execute with guidance |
| Neither | Manual | Justify why no match |
</action_map>

<rules>
- Show this analysis to user before acting
- Agent match → pass relevant skills: "RECOMMENDED SKILLS: [name] - [usage]"
- Skill match → MUST invoke before executing (gather context first is OK)
- Max 3 concurrent agents for independent tasks
</rules>
</delegation_protocol>`);

    log('=== Delegation finder completed ===');
}

main().catch(e => {
    log(`Fatal error: ${e.message}`);
    console.error(`<error>${e.message}</error>`);
    process.exit(1);
});
