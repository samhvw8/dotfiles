#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface HookInput {
    session_id: string;
    transcript_path: string;
    cwd: string;
    permission_mode: string;
    prompt: string;
}

// Keywords can be string (auto-weight) or {value, weight} (user-defined weight)
type WeightedKeyword = string | { value: string; weight: number };

interface PromptTriggers {
    keywords?: WeightedKeyword[];
    intentPatterns?: WeightedKeyword[];
}

// Confidence level configuration - easily extensible
interface ConfidenceLevelConfig {
    level: string;
    minScore: number;
    enforcement: string;
    icon: string;
    showDesc: boolean;
    displayLimit: number;
    actionTemplate: string;
}

const CONFIDENCE_LEVELS: ConfidenceLevelConfig[] = [
    {
        level: 'critical',
        minScore: 12.0,
        enforcement: 'HIGHLY RECOMMENDED',
        icon: '⭐',
        showDesc: true,
        displayLimit: 5,
        actionTemplate: '🎯 ACTION: Use Task(subagent_type="{agent}") NOW'
    },
    {
        level: 'high',
        minScore: 8.0,
        enforcement: 'RECOMMENDED',
        icon: '💎',
        showDesc: true,
        displayLimit: 5,
        actionTemplate: '💎 RECOMMENDED: Use "{agent}" agent'
    },
    {
        level: 'medium',
        minScore: 4.0,
        enforcement: 'SUGGESTED',
        icon: '💡',
        showDesc: true,
        displayLimit: 3,
        actionTemplate: '💡 SUGGESTED: Consider "{agent}" agent'
    },
    {
        level: 'low',
        minScore: 2.0,
        enforcement: 'AVAILABLE',
        icon: '📌',
        showDesc: false,
        displayLimit: 2,
        actionTemplate: '📌 TIP: Agents available if needed'
    }
];

const MIN_SCORE = CONFIDENCE_LEVELS[CONFIDENCE_LEVELS.length - 1].minScore;

interface AgentRule {
    type: 'exploration' | 'architecture' | 'language' | 'quality' | 'infrastructure' | 'design';
    enforcement: 'block' | 'suggest' | 'warn';
    priority: 'critical' | 'high' | 'medium' | 'low';
    description?: string;
    model?: 'haiku' | 'sonnet' | 'opus';
    promptTriggers?: PromptTriggers;
}

interface AgentRules {
    version: string;
    description?: string;
    agents: Record<string, AgentRule>;
}

interface MatchDetail {
    value: string;
    weight: number;
    matchType: 'keyword' | 'intent';
}

interface MatchedAgent {
    name: string;
    matchType: 'keyword' | 'intent';
    config: AgentRule;
    matches: MatchDetail[];
    score: number;
    confidenceConfig: ConfidenceLevelConfig;
}

interface AgentRulesPaths {
    global: string | null;
    project: string | null;
}

// Priority multipliers for scoring
const PRIORITY_MULTIPLIER: Record<string, number> = {
    critical: 4.0,
    high: 3.0,
    medium: 2.0,
    low: 1.0
};

// Diminishing returns factor for multiple matches
const DIMINISHING_FACTOR = 0.4;

/**
 * Calculate weight for a keyword based on specificity
 */
function calculateKeywordWeight(keyword: string): number {
    const words = keyword.split(/\s+/).length;
    const length = keyword.length;
    const lengthWeight = Math.min(length / 15, 2.0);
    const wordBonus = Math.min((words - 1) * 0.3, 1.0);
    return Math.max(0.5, lengthWeight + wordBonus);
}

/**
 * Extract value and weight from a weighted keyword
 */
function parseWeightedKeyword(kw: WeightedKeyword): { value: string; weight: number } {
    if (typeof kw === 'string') {
        return { value: kw, weight: calculateKeywordWeight(kw) };
    }
    return { value: kw.value, weight: kw.weight };
}

/**
 * Calculate final score with diminishing returns
 */
function calculateScore(matches: MatchDetail[], priority: string): number {
    if (matches.length === 0) return 0;
    const sortedMatches = [...matches].sort((a, b) => b.weight - a.weight);
    let totalWeight = 0;
    sortedMatches.forEach((match, index) => {
        const diminishingMultiplier = 1 / (1 + DIMINISHING_FACTOR * index);
        totalWeight += match.weight * diminishingMultiplier;
    });
    const priorityMult = PRIORITY_MULTIPLIER[priority] || 1.0;
    return totalWeight * priorityMult;
}

/**
 * Get confidence level config based on score
 */
function getConfidenceConfig(score: number): ConfidenceLevelConfig {
    for (const config of CONFIDENCE_LEVELS) {
        if (score >= config.minScore) {
            return config;
        }
    }
    return CONFIDENCE_LEVELS[CONFIDENCE_LEVELS.length - 1];
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Orchestration guidance for subagent delegation
 * Inspired by: https://github.com/PaulRBerg/ai-flags
 */
const ORCHESTRATION_GUIDANCE = `
📋 EXECUTION PRIORITY:
  1. Specialized sub-agent (Task tool) → First choice
  2. Skill (Skill tool) → If no specialized agent
  3. general-purpose agent OR manual → Last resort

📋 DELEGATION STRATEGY:
  • Independent tasks → Spawn multiple subagents in PARALLEL (single message, multiple Task calls)
  • Dependent tasks → Use single subagent for entire sequential workflow
  • Hybrid workflows → Handle prerequisites first, then parallelize independent work

⚠️ INDEPENDENCE RULE: Each task MUST be self-contained—no dependencies on other concurrent tasks.

⚡ ORCHESTRATE, DON'T IMPLEMENT: Delegate all implementation to subagents. Review their work at the end.
`;

/**
 * Find both global and project-level agent-rules.json paths
 */
function findAgentRulesPaths(cwd: string): AgentRulesPaths {
    const globalRulesPath = join(homedir(), '.claude', 'agents', 'agent-rules.json');
    const projectRulesPath = join(cwd, '.claude', 'agents', 'agent-rules.json');

    return {
        global: existsSync(globalRulesPath) ? globalRulesPath : null,
        project: existsSync(projectRulesPath) ? projectRulesPath : null
    };
}

/**
 * Load agent rules from a file path
 */
function loadAgentRules(path: string): AgentRules | null {
    try {
        const content = readFileSync(path, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.error(`Warning: Failed to load agent rules from ${path}:`, err);
        return null;
    }
}

/**
 * Merge global and project agent rules
 * Project rules override global rules for the same agent name
 */
function mergeAgentRules(global: AgentRules | null, project: AgentRules | null): AgentRules | null {
    // If no rules exist, return null
    if (!global && !project) {
        return null;
    }

    // If only one exists, return it
    if (!global) return project;
    if (!project) return global;

    // Merge both: project overrides global
    const merged: AgentRules = {
        version: project.version || global.version,
        description: project.description || global.description,
        agents: {
            // Start with global agents
            ...global.agents,
            // Override with project agents
            ...project.agents
        }
    };

    return merged;
}

async function main() {
    try {
        // Read and parse stdin
        const input = readFileSync(0, 'utf-8');
        const data: HookInput = JSON.parse(input);
        const prompt = data.prompt.toLowerCase();

        // Find both global and project-level agent-rules.json
        const paths = findAgentRulesPaths(data.cwd || process.cwd());

        // Load both rule sets
        const globalRules = paths.global ? loadAgentRules(paths.global) : null;
        const projectRules = paths.project ? loadAgentRules(paths.project) : null;

        // Merge rules (project overrides global)
        const rules = mergeAgentRules(globalRules, projectRules);

        // If no rules are available, exit silently
        if (!rules) {
            process.exit(0);
        }

        // Track matched agents with scoring
        const matchedAgentsMap = new Map<string, MatchedAgent>();

        // Check each agent for matches
        for (const [agentName, config] of Object.entries(rules.agents)) {
            const triggers = config.promptTriggers;
            if (!triggers) continue;

            const matches: MatchDetail[] = [];

            // Check keyword triggers - collect ALL matches for scoring
            if (triggers.keywords) {
                for (const kw of triggers.keywords) {
                    const { value, weight } = parseWeightedKeyword(kw);
                    const kwLower = value.toLowerCase();

                    // For short keywords (<=4 chars), use word boundary matching
                    let matched = false;
                    if (kwLower.length <= 4) {
                        const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(kwLower)}\\b`, 'i');
                        matched = wordBoundaryRegex.test(prompt);
                    } else {
                        matched = prompt.includes(kwLower);
                    }

                    if (matched) {
                        matches.push({ value, weight, matchType: 'keyword' });
                    }
                }
            }

            // Check intent pattern triggers - collect ALL matches
            if (triggers.intentPatterns) {
                for (const pat of triggers.intentPatterns) {
                    const { value, weight } = parseWeightedKeyword(pat);
                    try {
                        const regex = new RegExp(value, 'i');
                        if (regex.test(data.prompt)) {
                            // Pattern matches get a slight bonus (more intentional)
                            matches.push({ value, weight: weight * 1.2, matchType: 'intent' });
                        }
                    } catch (err) {
                        continue;
                    }
                }
            }

            // Only add if we have matches
            if (matches.length > 0) {
                const score = calculateScore(matches, config.priority);
                const confidenceConfig = getConfidenceConfig(score);

                matchedAgentsMap.set(agentName, {
                    name: agentName,
                    matchType: matches[0].matchType,
                    config,
                    matches,
                    score,
                    confidenceConfig
                });
            }
        }

        // No matches - exit silently
        if (matchedAgentsMap.size === 0) {
            process.exit(0);
        }

        // Sort by score and filter below minimum
        const matchedAgents = Array.from(matchedAgentsMap.values())
            .filter(a => a.score >= MIN_SCORE)
            .sort((a, b) => b.score - a.score);

        if (matchedAgents.length === 0) {
            process.exit(0);
        }

        // Group by confidence level
        const byLevel = new Map<string, MatchedAgent[]>();
        for (const levelConfig of CONFIDENCE_LEVELS) {
            byLevel.set(levelConfig.level, matchedAgents.filter(
                a => a.confidenceConfig.level === levelConfig.level
            ));
        }

        // Build output message
        let output = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        output += '💡 SPECIALIZED AGENTS AVAILABLE\n';
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

        // Display each confidence level using config
        for (const levelConfig of CONFIDENCE_LEVELS) {
            const agents = byLevel.get(levelConfig.level) || [];
            if (agents.length === 0) continue;

            const displayAgents = agents.slice(0, levelConfig.displayLimit);

            output += `${levelConfig.icon} ${levelConfig.enforcement}:\n`;
            displayAgents.forEach(agent => {
                output += `  → ${agent.name} [${agent.score.toFixed(1)}]`;
                if (agent.config.model) {
                    output += ` (${agent.config.model})`;
                }
                if (levelConfig.showDesc && agent.config.description) {
                    const shortDesc = agent.config.description.split('.')[0];
                    output += ` - ${shortDesc}`;
                }
                output += '\n';
            });

            if (agents.length > levelConfig.displayLimit) {
                output += `  ... +${agents.length - levelConfig.displayLimit} more\n`;
            }
            output += '\n';
        }

        // Always show orchestration guidance
        output += ORCHESTRATION_GUIDANCE;
        output += '\n';

        // Action instruction based on best match
        const bestMatch = matchedAgents[0];
        const actionText = bestMatch.confidenceConfig.actionTemplate.replace('{agent}', bestMatch.name);
        output += actionText + '\n';

        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

        console.log(output);
        process.exit(0);
    } catch (err) {
        // Log error to stderr but don't fail the hook
        // This ensures Claude Code continues working even if hook has issues
        console.error('Error in agent-activation-prompt hook:', err);
        process.exit(0); // Exit successfully to not block workflow
    }
}

main().catch(err => {
    console.error('Uncaught error in agent-activation-prompt:', err);
    process.exit(0); // Exit successfully to not block workflow
});
