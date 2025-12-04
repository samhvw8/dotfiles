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
// Add new levels by adding to this array (order matters: highest first)
interface ConfidenceLevelConfig {
    level: string;
    minScore: number;
    enforcement: string;
    icon: string;
    showDesc: boolean;
    displayLimit: number;
    actionTemplate: string;  // Use {skill} as placeholder
}

const CONFIDENCE_LEVELS: ConfidenceLevelConfig[] = [
    {
        level: 'critical',
        minScore: 12.0,
        enforcement: 'REQUIRED',
        icon: '🔴',
        showDesc: true,
        displayLimit: 5,
        actionTemplate: '🔴 ACTION: Use Skill tool with "{skill}" NOW'
    },
    {
        level: 'high',
        minScore: 8.0,
        enforcement: 'RECOMMENDED',
        icon: '🟠',
        showDesc: true,
        displayLimit: 5,
        actionTemplate: '🟠 RECOMMENDED: Use "{skill}" skill'
    },
    {
        level: 'medium',
        minScore: 4.0,
        enforcement: 'SUGGESTED',
        icon: '🟡',
        showDesc: true,
        displayLimit: 3,
        actionTemplate: '🟡 SUGGESTED: Consider "{skill}" skill'
    },
    {
        level: 'low',
        minScore: 2.0,
        enforcement: 'OPTIONAL',
        icon: '🟢',
        showDesc: false,
        displayLimit: 2,
        actionTemplate: '🟢 TIP: Skills available if needed'
    }
    // Add more levels here as needed:
    // { level: 'hint', minScore: 1.0, enforcement: 'HINT', icon: '⚪', ... }
];

// Minimum score to show any skill
const MIN_SCORE = CONFIDENCE_LEVELS[CONFIDENCE_LEVELS.length - 1].minScore;

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

interface MatchDetail {
    value: string;
    weight: number;
    matchType: 'keyword' | 'intent';
}

interface MatchedSkill {
    name: string;
    matchType: 'keyword' | 'intent';
    config: SkillRule;
    matches: MatchDetail[];
    score: number;
    confidenceConfig: ConfidenceLevelConfig;
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
 * Longer, multi-word keywords are more specific = higher weight
 */
function calculateKeywordWeight(keyword: string): number {
    const words = keyword.split(/\s+/).length;
    const length = keyword.length;

    // Base weight from length (normalized)
    const lengthWeight = Math.min(length / 15, 2.0);

    // Bonus for multi-word phrases (more specific)
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

    // Sort matches by weight descending
    const sortedMatches = [...matches].sort((a, b) => b.weight - a.weight);

    // Apply diminishing returns: each subsequent match contributes less
    let totalWeight = 0;
    sortedMatches.forEach((match, index) => {
        const diminishingMultiplier = 1 / (1 + DIMINISHING_FACTOR * index);
        totalWeight += match.weight * diminishingMultiplier;
    });

    // Apply priority multiplier
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
    // Fallback to lowest level
    return CONFIDENCE_LEVELS[CONFIDENCE_LEVELS.length - 1];
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Orchestration guidance reminder
 */
const ORCHESTRATION_GUIDANCE = `
📋 EXECUTION PRIORITY:
  1. Specialized sub-agent (Task tool) → First choice
  2. Skill (Skill tool) → If no specialized agent
  3. general-purpose agent OR manual → Last resort

⚠️ INDEPENDENCE RULE: Each task MUST be self-contained—no dependencies on other concurrent tasks.
`;

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

        // Track matched skills with scoring
        const matchedSkillsMap = new Map<string, MatchedSkill>();

        // Check each skill for matches
        for (const [skillName, config] of Object.entries(rules.skills)) {
            const triggers = config.promptTriggers;
            if (!triggers) continue;

            const matches: MatchDetail[] = [];

            // Check keyword triggers - collect ALL matches for scoring
            if (triggers.keywords) {
                for (const kw of triggers.keywords) {
                    const { value, weight } = parseWeightedKeyword(kw);
                    const kwLower = value.toLowerCase();

                    // For short keywords (<=4 chars), use word boundary matching
                    // to avoid false positives (e.g., "doc" matching "docker")
                    let matched = false;
                    if (kwLower.length <= 4) {
                        const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(kwLower)}\\b`, 'i');
                        matched = wordBoundaryRegex.test(prompt);
                    } else {
                        matched = prompt.includes(kwLower);
                    }

                    if (matched) {
                        matches.push({
                            value,
                            weight,
                            matchType: 'keyword'
                        });
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
                            matches.push({
                                value,
                                weight: weight * 1.2,
                                matchType: 'intent'
                            });
                        }
                    } catch (err) {
                        // Skip invalid regex patterns
                        continue;
                    }
                }
            }

            // Only add if we have matches
            if (matches.length > 0) {
                const score = calculateScore(matches, config.priority);
                const confidenceConfig = getConfidenceConfig(score);

                matchedSkillsMap.set(skillName, {
                    name: skillName,
                    matchType: matches[0].matchType,
                    config,
                    matches,
                    score,
                    confidenceConfig
                });
            }
        }

        // No matches - exit silently
        if (matchedSkillsMap.size === 0) {
            process.exit(0);
        }

        // Sort all matched skills by score (descending) and filter below minimum
        const matchedSkills = Array.from(matchedSkillsMap.values())
            .filter(s => s.score >= MIN_SCORE)
            .sort((a, b) => b.score - a.score);

        // All matches filtered out - exit silently
        if (matchedSkills.length === 0) {
            process.exit(0);
        }

        // Group by confidence level
        const byLevel = new Map<string, MatchedSkill[]>();
        for (const levelConfig of CONFIDENCE_LEVELS) {
            byLevel.set(levelConfig.level, matchedSkills.filter(
                s => s.confidenceConfig.level === levelConfig.level
            ));
        }

        // Build output message
        let output = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        output += '🎯 SKILL ACTIVATION\n';
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

        // Display each confidence level using config
        for (const levelConfig of CONFIDENCE_LEVELS) {
            const skills = byLevel.get(levelConfig.level) || [];
            if (skills.length === 0) continue;

            const displaySkills = skills.slice(0, levelConfig.displayLimit);

            output += `${levelConfig.icon} ${levelConfig.enforcement}:\n`;
            displaySkills.forEach(skill => {
                output += `  → ${skill.name} [${skill.score.toFixed(1)}]`;
                if (levelConfig.showDesc && skill.config.description) {
                    const shortDesc = skill.config.description.split('.')[0];
                    output += ` - ${shortDesc}`;
                }
                output += '\n';
            });

            if (skills.length > levelConfig.displayLimit) {
                output += `  ... +${skills.length - levelConfig.displayLimit} more\n`;
            }
            output += '\n';
        }

        // Always show orchestration guidance
        output += ORCHESTRATION_GUIDANCE;
        output += '\n';

        // Action instruction based on best match
        const bestMatch = matchedSkills[0];
        const actionText = bestMatch.confidenceConfig.actionTemplate.replace('{skill}', bestMatch.name);
        output += actionText + '\n';

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
