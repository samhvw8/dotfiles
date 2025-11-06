#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

interface HookInput {
  session_id: string;
  transcript_path: string;
  working_directory: string;
  permission_mode: string;
  prompt: string;
}

interface SkillRule {
  enforcement?: "block" | "suggest" | "warn";
  priority?: "critical" | "high" | "medium" | "low";
  promptTriggers?: {
    keywords?: string[];
    intentPatterns?: string[];
  };
  fileTriggers?: {
    pathPatterns?: string[];
    contentPatterns?: string[];
  };
  blockMessage?: string;
  skipConditions?: {
    sessionSkillUsed?: string[];
    fileMarkers?: string[];
  };
}

interface MatchedSkill {
  name: string;
  enforcement: string;
  priority: string;
  reason: string;
}

async function main() {
  try {
    // Read input from stdin
    const input = fs.readFileSync(0, "utf-8");
    const hookInput: HookInput = JSON.parse(input);

    const prompt = hookInput.prompt.toLowerCase();
    let workingDir = hookInput.working_directory;

    // Fallback to HOME if working_directory is not provided
    if (!workingDir || workingDir === ".") {
      workingDir = process.env.HOME || process.cwd();
    }

    // Try to load skill rules from multiple locations
    // 1. Project-specific rules: $PROJECT/.claude/skills/skill-rules.json
    // 2. Global rules: $HOME/.claude/skills/skill-rules.json
    let skillRulesPath = path.join(workingDir, ".claude", "skills", "skill-rules.json");

    if (!fs.existsSync(skillRulesPath)) {
      // Try global rules in HOME directory
      const homeDir = process.env.HOME || require('os').homedir();
      skillRulesPath = path.join(homeDir, ".claude", "skills", "skill-rules.json");

      if (!fs.existsSync(skillRulesPath)) {
        // No skill rules configured anywhere, exit silently
        process.exit(0);
      }
    }

    const skillRules: Record<string, SkillRule> = JSON.parse(
      fs.readFileSync(skillRulesPath, "utf-8")
    );

    const matchedSkills: MatchedSkill[] = [];

    // Check each skill rule
    for (const [skillName, rule] of Object.entries(skillRules)) {
      const enforcement = rule.enforcement || "suggest";
      const priority = rule.priority || "medium";

      // Check prompt triggers
      if (rule.promptTriggers) {
        // Keyword matching
        if (rule.promptTriggers.keywords) {
          for (const keyword of rule.promptTriggers.keywords) {
            if (prompt.includes(keyword.toLowerCase())) {
              matchedSkills.push({
                name: skillName,
                enforcement,
                priority,
                reason: `keyword: "${keyword}"`,
              });
              break;
            }
          }
        }

        // Intent pattern matching
        if (rule.promptTriggers.intentPatterns) {
          for (const pattern of rule.promptTriggers.intentPatterns) {
            const regex = new RegExp(pattern, "i");
            if (regex.test(hookInput.prompt)) {
              matchedSkills.push({
                name: skillName,
                enforcement,
                priority,
                reason: `intent pattern: "${pattern}"`,
              });
              break;
            }
          }
        }
      }
    }

    // If no skills matched, exit silently
    if (matchedSkills.length === 0) {
      process.exit(0);
    }

    // Group by priority
    const byPriority: Record<string, MatchedSkill[]> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };

    for (const skill of matchedSkills) {
      byPriority[skill.priority].push(skill);
    }

    // Generate output
    console.log("\n╔═══════════════════════════════════════════════════════════╗");
    console.log("║               🎯 SKILL ACTIVATION DETECTED                ║");
    console.log("╚═══════════════════════════════════════════════════════════╝\n");

    let hasBlockingSkills = false;

    for (const priority of ["critical", "high", "medium", "low"] as const) {
      const skills = byPriority[priority];
      if (skills.length === 0) continue;

      const priorityLabels = {
        critical: "🔴 CRITICAL (Required)",
        high: "🟠 HIGH (Recommended)",
        medium: "🟡 MEDIUM (Suggested)",
        low: "🟢 LOW (Optional)",
      };

      console.log(`\n${priorityLabels[priority]}`);
      console.log("─".repeat(60));

      for (const skill of skills) {
        const enforcementIcon = {
          block: "🚫",
          warn: "⚠️",
          suggest: "💡",
        }[skill.enforcement];

        console.log(`  ${enforcementIcon} ${skill.name}`);
        console.log(`     Matched: ${skill.reason}`);

        if (skill.enforcement === "block") {
          hasBlockingSkills = true;
        }
      }
    }

    console.log("\n" + "─".repeat(60));
    console.log("\n📋 INSTRUCTIONS:");

    if (hasBlockingSkills) {
      console.log("   ⚠️  You MUST use the Skill tool for blocking skills before proceeding");
    } else {
      console.log("   💡 Consider using the Skill tool for relevant skills");
    }

    console.log("   Example: Skill tool with command: skill-name\n");
    console.log("═".repeat(60) + "\n");

  } catch (error) {
    console.error("Error in skill-activation-prompt hook:", error);
    process.exit(1);
  }
}

main();
