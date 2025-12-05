# Skill Scoring System (v2.0)

## Overview

The scoring system determines skill relevance based on keyword/pattern matches, enabling dynamic enforcement levels.

## How Scoring Works

Each matched keyword/pattern contributes to a skill's score:

1. **Base Weight**: Auto-calculated from keyword length, or user-defined
2. **Pattern Bonus**: Intent patterns get 1.2x multiplier
3. **Priority Multiplier**: `{critical: 4.0, high: 3.0, medium: 2.0, low: 1.0}`
4. **Diminishing Returns**: Each additional match contributes less (factor: 0.4)

**Formula:**
```
score = sum(weight × diminishing) × priorityMultiplier
diminishing = 1 / (1 + 0.4 × matchIndex)
```

## Weight Guidelines

| Level | Weight | Use For |
|-------|--------|---------|
| High | 3.0-5.0 | Very specific terms (k8s, kubectl, eks, specific tool names) |
| Medium | 1.5-3.0 | Domain terms (deployment, container, database) |
| Low | 0.5-1.5 | Generic terms (help, create, fix, build) |

### Auto-Weight Calculation

When weight not specified, calculated from keyword:
```typescript
lengthWeight = min(keyword.length / 15, 2.0)
wordBonus = min((wordCount - 1) * 0.3, 1.0)
weight = max(0.5, lengthWeight + wordBonus)
```

- Short keywords (≤4 chars): Use word boundary matching to avoid false positives
- Multi-word phrases: Get bonus for specificity

## Weighted Keywords in skill-rules.json

**String format (auto-weight):**
```json
"keywords": ["deployment", "container", "pod"]
```

**Object format (user-defined weight):**
```json
"keywords": [
    {"value": "k8s", "weight": 5.0},
    {"value": "kubectl", "weight": 5.0},
    {"value": "eks", "weight": 5.0},
    "deployment",
    "container"
]
```

**When to use user-defined weights:**
- Short but very specific terms (k8s, eks, gke, aks)
- Domain-specific abbreviations
- Terms that auto-weight undervalues

## Confidence Levels

Score determines dynamic enforcement:

| Level | Min Score | Enforcement | Icon | Description |
|-------|-----------|-------------|------|-------------|
| critical | ≥12.0 | REQUIRED | 🔴 | Very strong match - action required |
| high | ≥8.0 | RECOMMENDED | 🟠 | Strong match - strongly recommended |
| medium | ≥4.0 | SUGGESTED | 🟡 | Good match - suggested |
| low | ≥2.0 | OPTIONAL | 🟢 | Weak match - consider |

Scores below 2.0 are filtered out (not shown).

## Adding New Confidence Levels

Edit `CONFIDENCE_LEVELS` array in `skill-activation-prompt.ts`:

```typescript
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
    // Add more levels here...
];
```

## Example Scoring

**Prompt:** "help me with k8s deployment"

**k8s-ops skill matches:**
- `k8s` (weight: 5.0, user-defined)
- `deployment` (weight: ~0.7, auto-calculated)
- Pattern `(kubernetes|k8s)` (weight: ~1.2 after bonus)

**Calculation:**
```
Match 1: 5.0 × 1.0 = 5.0
Match 2: 0.7 × 0.71 = 0.5  (diminished)
Match 3: 1.2 × 0.56 = 0.67 (further diminished)
Total weight: 6.17
Priority multiplier (high): 3.0
Final score: 6.17 × 3.0 = 18.5 → critical
```

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SKILL ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 REQUIRED:
  → k8s-ops [18.5] - Production Kubernetes...

🔴 ACTION: Use Skill tool with "k8s-ops" NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Best Practices

1. **Use high weights for short, specific terms** - "k8s" should score higher than "container"
2. **Let auto-weight handle generic terms** - Don't over-specify
3. **Test with real prompts** - Verify scoring matches expectations
4. **Adjust thresholds if needed** - Edit `CONFIDENCE_LEVELS` array
5. **Add abbreviations and synonyms** - "pr", "mr", "2nd opinion", etc.

## Related Files

- `skill-activation-prompt.ts` - Scoring logic and confidence levels
- `skill-rules.json` - Keyword/pattern definitions with weights
