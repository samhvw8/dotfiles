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

interface SkillRule {
    type: 'guardrail' | 'domain';
    enforcement: 'block' | 'suggest' | 'warn';
    priority: 'critical' | 'high' | 'medium' | 'low';
    description?: string;
    promptTriggers?: PromptTriggers;
}

interface SkillRules {
    version: string;
    description?: string;
    skills: Record<string, SkillRule>;
}

interface MatchedSkill {
    name: string;
    matchType: 'keyword' | 'intent';
    config: SkillRule;
}

interface SkillRulesPaths {
    global: string | null;
    project: string | null;
}

/**
 * Find both global and project-level skill-rules.json paths
 */
function findSkillRulesPaths(cwd: string): SkillRulesPaths {
    const globalRulesPath = join(homedir(), '.claude', 'skills', 'skill-rules.json');
    const projectRulesPath = join(cwd, '.claude', 'skills', 'skill-rules.json');

    return {
        global: existsSync(globalRulesPath) ? globalRulesPath : null,
        project: existsSync(projectRulesPath) ? projectRulesPath : null
    };
}

/**
 * Load skill rules from a file path
 */
function loadSkillRules(path: string): SkillRules | null {
    try {
        const content = readFileSync(path, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.error(`Warning: Failed to load skill rules from ${path}:`, err);
        return null;
    }
}

/**
 * Merge global and project skill rules
 * Project rules override global rules for the same skill name
 */
function mergeSkillRules(global: SkillRules | null, project: SkillRules | null): SkillRules | null {
    // If no rules exist, return null
    if (!global && !project) {
        return null;
    }

    // If only one exists, return it
    if (!global) return project;
    if (!project) return global;

    // Merge both: project overrides global
    const merged: SkillRules = {
        version: project.version || global.version,
        description: project.description || global.description,
        skills: {
            // Start with global skills
            ...global.skills,
            // Override with project skills
            ...project.skills
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

        // Find both global and project-level skill-rules.json
        const paths = findSkillRulesPaths(data.cwd || process.cwd());

        // Load both rule sets
        const globalRules = paths.global ? loadSkillRules(paths.global) : null;
        const projectRules = paths.project ? loadSkillRules(paths.project) : null;

        // Merge rules (project overrides global)
        const rules = mergeSkillRules(globalRules, projectRules);

        // If no rules are available, exit silently
        if (!rules) {
            process.exit(0);
        }

        // Track matched skills (deduplicated by name)
        const matchedSkillsMap = new Map<string, MatchedSkill>();

        // Check each skill for matches
        for (const [skillName, config] of Object.entries(rules.skills)) {
            const triggers = config.promptTriggers;
            if (!triggers) continue;

            let matched = false;

            // Check keyword triggers
            if (triggers.keywords && !matched) {
                for (const keyword of triggers.keywords) {
                    if (prompt.includes(keyword.toLowerCase())) {
                        matchedSkillsMap.set(skillName, {
                            name: skillName,
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
                            matchedSkillsMap.set(skillName, {
                                name: skillName,
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
        if (matchedSkillsMap.size === 0) {
            process.exit(0);
        }

        // Group by priority
        const matchedSkills = Array.from(matchedSkillsMap.values());
        const byPriority = {
            critical: matchedSkills.filter(s => s.config.priority === 'critical'),
            high: matchedSkills.filter(s => s.config.priority === 'high'),
            medium: matchedSkills.filter(s => s.config.priority === 'medium'),
            low: matchedSkills.filter(s => s.config.priority === 'low')
        };

        // Build output message
        let output = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        output += '🎯 SKILL ACTIVATION CHECK\n';
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

        // Add matched skills by priority
        const priorityLabels = {
            critical: { icon: '⚠️', label: 'CRITICAL SKILLS (REQUIRED)' },
            high: { icon: '📚', label: 'RECOMMENDED SKILLS' },
            medium: { icon: '💡', label: 'SUGGESTED SKILLS' },
            low: { icon: '📌', label: 'OPTIONAL SKILLS' }
        };

        for (const [priority, label] of Object.entries(priorityLabels)) {
            const skills = byPriority[priority as keyof typeof byPriority];
            if (skills.length > 0) {
                output += `${label.icon} ${label.label}:\n`;
                skills.forEach(skill => {
                    output += `  → ${skill.name}`;
                    if (skill.config.description) {
                        const shortDesc = skill.config.description.split('.')[0];
                        output += ` - ${shortDesc}`;
                    }
                    output += '\n';
                });
                output += '\n';
            }
        }

        // Add action instruction
        const hasHighPriority = byPriority.critical.length > 0 || byPriority.high.length > 0;
        if (hasHighPriority) {
            output += '⚡ ACTION: Use Skill tool BEFORE responding\n';
        } else {
            output += '💡 TIP: Consider using Skill tool for better results\n';
        }

        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

        console.log(output);
        process.exit(0);
    } catch (err) {
        // Log error to stderr but don't fail the hook
        // This ensures Claude Code continues working even if hook has issues
        console.error('Error in skill-activation-prompt hook:', err);
        process.exit(0); // Exit successfully to not block workflow
    }
}

main().catch(err => {
    console.error('Uncaught error in skill-activation-prompt:', err);
    process.exit(0); // Exit successfully to not block workflow
});
