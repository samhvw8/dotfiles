#!/usr/bin/env -S npx tsx

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
    const matchedSkillNames = new Set<string>();

    // Check each skill rule
    for (const [skillName, rule] of Object.entries(skillRules)) {
      const enforcement = rule.enforcement || "suggest";
      const priority = rule.priority || "medium";
      let skillMatched = false;

      // Check prompt triggers
      if (rule.promptTriggers) {
        // Keyword matching
        if (rule.promptTriggers.keywords && !skillMatched) {
          for (const keyword of rule.promptTriggers.keywords) {
            if (prompt.includes(keyword.toLowerCase())) {
              matchedSkills.push({
                name: skillName,
                enforcement,
                priority,
                reason: `keyword: "${keyword}"`,
              });
              matchedSkillNames.add(skillName);
              skillMatched = true;
              break;
            }
          }
        }

        // Intent pattern matching
        if (rule.promptTriggers.intentPatterns && !skillMatched) {
          for (const pattern of rule.promptTriggers.intentPatterns) {
            const regex = new RegExp(pattern, "i");
            if (regex.test(hookInput.prompt)) {
              matchedSkills.push({
                name: skillName,
                enforcement,
                priority,
                reason: `intent pattern: "${pattern}"`,
              });
              matchedSkillNames.add(skillName);
              skillMatched = true;
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

    // Get unique skill names for invocation
    const uniqueSkillNames = Array.from(matchedSkillNames);

    // Generate output
    console.log("\n╔═══════════════════════════════════════════════════════════╗");
    console.log("║          🎯 ANTHROPIC SKILL DETECTED - ACTION REQUIRED    ║");
    console.log("╚═══════════════════════════════════════════════════════════╝");
    console.log("");
    console.log("<context>");
    console.log("This hook guides Claude Code to use specialized Anthropic Skills—expert");
    console.log("agents with domain knowledge, battle-tested patterns, and optimized workflows.");
    console.log("</context>");
    console.log("");

    let hasBlockingSkills = false;

    console.log("<matched_skills>");
    for (const priority of ["critical", "high", "medium", "low"] as const) {
      const skills = byPriority[priority];
      if (skills.length === 0) continue;

      const priorityLabels = {
        critical: "🔴 CRITICAL",
        high: "🟠 HIGH",
        medium: "🟡 MEDIUM",
        low: "🟢 LOW",
      };

      console.log(`\n${priorityLabels[priority]}`);
      console.log("─".repeat(60));

      // Track unique skills already shown at this priority level
      const shownAtLevel = new Set<string>();

      for (const skill of skills) {
        if (shownAtLevel.has(skill.name)) continue;
        shownAtLevel.add(skill.name);

        const enforcementIcon = {
          block: "🚫",
          warn: "⚠️",
          suggest: "💡",
        }[skill.enforcement];

        console.log(`  ${enforcementIcon} ${skill.name}`);

        if (skill.enforcement === "block") {
          hasBlockingSkills = true;
        }
      }
    }
    console.log("</matched_skills>");
    console.log("");

    // Determine instruction level based on highest priority
    const hasCritical = byPriority.critical.length > 0;
    const hasHigh = byPriority.high.length > 0;
    const hasMedium = byPriority.medium.length > 0;

    if (hasBlockingSkills || hasCritical || hasHigh) {
      console.log("╔═══════════════════════════════════════════════════════════╗");
      console.log("║                  🚨 MANDATORY SKILL USAGE                 ║");
      console.log("╚═══════════════════════════════════════════════════════════╝");
      console.log("");
      console.log("<instruction>");
      console.log("STOP! You MUST invoke the Anthropic Skill using the Skill tool.");
      console.log("Manual implementation is PROHIBITED for this request.");
      console.log("</instruction>");
      console.log("");

      console.log("<required_action>");
      const primarySkill = uniqueSkillNames[0] || "skill-enhancer";
      console.log("Invoke: Skill tool with skill: \"" + primarySkill + "\"");
      if (uniqueSkillNames.length > 1) {
        const alternatives = uniqueSkillNames.slice(1, 3).map(s => `"${s}"`).join(" or ");
        console.log("Alternatives: " + alternatives);
      }
      console.log("</required_action>");
      console.log("");

      console.log("<prohibited>");
      console.log("❌ Read/Write/Edit tools for implementation");
      console.log("❌ Manual code generation");
      console.log("❌ Proceeding without skill invocation");
      console.log("</prohibited>");
    } else if (hasMedium) {
      console.log("╔═══════════════════════════════════════════════════════════╗");
      console.log("║                   💡 SKILL RECOMMENDED                    ║");
      console.log("╚═══════════════════════════════════════════════════════════╝");
      console.log("");

      console.log("<recommendation>");
      console.log("Specialized Anthropic Skills detected for this request.");
      console.log("Strongly consider invoking skill before manual implementation.");
      console.log("</recommendation>");
      console.log("");

      console.log("<suggested_action>");
      const mediumSkillsArray = uniqueSkillNames.slice(0, 2);
      console.log("Invoke: Skill tool with skill: \"" + mediumSkillsArray[0] + "\"");
      if (mediumSkillsArray.length > 1) {
        console.log("Alternative: \"" + mediumSkillsArray[1] + "\"");
      }
      console.log("</suggested_action>");
      console.log("");

      console.log("<benefits>");
      console.log("• Domain-specific patterns and best practices");
      console.log("• Consistent, production-grade output");
      console.log("• Reduced implementation time");
      console.log("</benefits>");
    } else {
      console.log("╔═══════════════════════════════════════════════════════════╗");
      console.log("║                   💡 OPTIONAL SKILL                       ║");
      console.log("╚═══════════════════════════════════════════════════════════╝");
      console.log("");

      console.log("<note>");
      console.log("Low-priority skill available. May provide value for this task.");
      console.log("</note>");
      console.log("");

      console.log("<optional_action>");
      const lowSkillsArray = uniqueSkillNames.slice(0, 2);
      console.log("Invoke: Skill tool with skill: \"" + lowSkillsArray[0] + "\"");
      if (lowSkillsArray.length > 1) {
        console.log("Alternative: \"" + lowSkillsArray[1] + "\"");
      }
      console.log("</optional_action>");
    }

    console.log("\n" + "═".repeat(60) + "\n");

  } catch (error) {
    console.error("Error in skill-activation-prompt hook:", error);
    process.exit(1);
  }
}

main();
