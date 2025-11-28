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

interface PromptTriggers {
    keywords?: string[];
    intentPatterns?: string[];
}

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

interface MatchedAgent {
    name: string;
    matchType: 'keyword' | 'intent';
    config: AgentRule;
}

interface AgentRulesPaths {
    global: string | null;
    project: string | null;
}

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

        // Track matched agents (deduplicated by name)
        const matchedAgentsMap = new Map<string, MatchedAgent>();

        // Check each agent for matches
        for (const [agentName, config] of Object.entries(rules.agents)) {
            const triggers = config.promptTriggers;
            if (!triggers) continue;

            let matched = false;

            // Check keyword triggers
            if (triggers.keywords && !matched) {
                for (const keyword of triggers.keywords) {
                    if (prompt.includes(keyword.toLowerCase())) {
                        matchedAgentsMap.set(agentName, {
                            name: agentName,
                            matchType: 'keyword',
                            config
                        });
                        matched = true;
                        break;
                    }
                }
            }

            // Check intent pattern triggers
            if (triggers.intentPatterns && !matched) {
                for (const pattern of triggers.intentPatterns) {
                    try {
                        const regex = new RegExp(pattern, 'i');
                        if (regex.test(data.prompt)) {
                            matchedAgentsMap.set(agentName, {
                                name: agentName,
                                matchType: 'intent',
                                config
                            });
                            matched = true;
                            break;
                        }
                    } catch (err) {
                        // Skip invalid regex patterns
                        continue;
                    }
                }
            }
        }

        // No matches - exit silently
        if (matchedAgentsMap.size === 0) {
            process.exit(0);
        }

        // Group by priority
        const matchedAgents = Array.from(matchedAgentsMap.values());
        const byPriority = {
            critical: matchedAgents.filter(a => a.config.priority === 'critical'),
            high: matchedAgents.filter(a => a.config.priority === 'high'),
            medium: matchedAgents.filter(a => a.config.priority === 'medium'),
            low: matchedAgents.filter(a => a.config.priority === 'low')
        };

        // Build output message
        let output = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        output += '💡 SPECIALIZED AGENTS AVAILABLE\n';
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

        // Add matched agents by priority
        const priorityLabels = {
            critical: { icon: '⭐', label: 'HIGHLY RECOMMENDED' },
            high: { icon: '💎', label: 'RECOMMENDED' },
            medium: { icon: '💡', label: 'SUGGESTED' },
            low: { icon: '📌', label: 'AVAILABLE' }
        };

        for (const [priority, label] of Object.entries(priorityLabels)) {
            const agents = byPriority[priority as keyof typeof byPriority];
            if (agents.length > 0) {
                output += `${label.icon} ${label.label}:\n`;
                agents.forEach(agent => {
                    output += `  → ${agent.name}`;
                    if (agent.config.model) {
                        output += ` (${agent.config.model})`;
                    }
                    if (agent.config.description) {
                        const shortDesc = agent.config.description.split('.')[0];
                        output += ` - ${shortDesc}`;
                    }
                    output += '\n';
                });
                output += '\n';
            }
        }

        // Add suggestion instruction
        const hasHighPriority = byPriority.critical.length > 0 || byPriority.high.length > 0;
        if (hasHighPriority) {
            output += '💡 Consider using: Task tool with subagent_type parameter\n';
            output += '   Example: Task(subagent_type="agent-name", prompt="your task")\n';
        } else {
            output += '💡 Optional: These agents may help with specialized tasks\n';
        }

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
