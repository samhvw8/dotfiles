#!/bin/bash
# skill-rules-crud.sh - Fast CRUD operations for skill-rules.json using jq
# Usage: ./skill-rules-crud.sh <command> [args...]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULES_FILE="${SCRIPT_DIR}/../../skill-rules.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure jq is available
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

# Validate JSON file exists
if [[ ! -f "$RULES_FILE" ]]; then
    echo -e "${RED}Error: skill-rules.json not found at $RULES_FILE${NC}"
    exit 1
fi

usage() {
    cat << EOF
${BLUE}skill-rules-crud.sh${NC} - Fast CRUD operations for skill-rules.json

${YELLOW}USAGE:${NC}
    ./skill-rules-crud.sh <command> [arguments...]

${YELLOW}COMMANDS:${NC}
    ${GREEN}list${NC}                              List all skills (names only)
    ${GREEN}list-full${NC}                         List all skills with details
    ${GREEN}get${NC} <skill-name>                  Get full skill configuration
    ${GREEN}get-keywords${NC} <skill-name>         Get keywords for a skill
    ${GREEN}get-patterns${NC} <skill-name>         Get intent patterns for a skill

    ${GREEN}create${NC} <skill-name>               Create new skill (interactive)
    ${GREEN}create-minimal${NC} <name> <desc> <priority>  Create minimal skill entry

    ${GREEN}add-keyword${NC} <skill> <keyword> [weight]   Add keyword to skill
    ${GREEN}add-pattern${NC} <skill> <pattern> [weight]   Add intent pattern to skill

    ${GREEN}remove-keyword${NC} <skill> <keyword>  Remove keyword from skill
    ${GREEN}remove-pattern${NC} <skill> <pattern>  Remove pattern from skill

    ${GREEN}update-priority${NC} <skill> <priority>       Update skill priority
    ${GREEN}update-enforcement${NC} <skill> <level>       Update enforcement level
    ${GREEN}update-description${NC} <skill> <desc>        Update skill description

    ${GREEN}delete${NC} <skill-name>               Delete a skill entirely

    ${GREEN}search${NC} <term>                     Search keywords/patterns across all skills
    ${GREEN}validate${NC}                          Validate JSON syntax
    ${GREEN}backup${NC}                            Create timestamped backup
    ${GREEN}stats${NC}                             Show statistics about skills

${YELLOW}EXAMPLES:${NC}
    ./skill-rules-crud.sh list
    ./skill-rules-crud.sh get docker
    ./skill-rules-crud.sh add-keyword docker "docker swarm" 4.5
    ./skill-rules-crud.sh add-pattern docker "swarm.*?(init|join)"
    ./skill-rules-crud.sh remove-keyword docker "old-keyword"
    ./skill-rules-crud.sh search "kubernetes"
    ./skill-rules-crud.sh create-minimal my-skill "Description here" high

${YELLOW}PRIORITY LEVELS:${NC}
    critical, high, medium, low

${YELLOW}ENFORCEMENT LEVELS:${NC}
    suggest, block, warn
EOF
}

# ============== READ OPERATIONS ==============

list_skills() {
    echo -e "${BLUE}Skills in skill-rules.json:${NC}"
    jq -r '.skills | keys[]' "$RULES_FILE" | sort
}

list_skills_full() {
    echo -e "${BLUE}Skills with details:${NC}"
    jq -r '.skills | to_entries[] | "\(.key): \(.value.priority // "medium") | \(.value.enforcement // "suggest") | \(.value.description // "No description")"' "$RULES_FILE" | sort
}

get_skill() {
    local skill="$1"
    if [[ -z "$skill" ]]; then
        echo -e "${RED}Error: Skill name required${NC}"
        exit 1
    fi

    local result
    result=$(jq -e ".skills[\"$skill\"]" "$RULES_FILE" 2>/dev/null)
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}Error: Skill '$skill' not found${NC}"
        exit 1
    fi
    echo "$result"
}

get_keywords() {
    local skill="$1"
    if [[ -z "$skill" ]]; then
        echo -e "${RED}Error: Skill name required${NC}"
        exit 1
    fi

    echo -e "${BLUE}Keywords for '$skill':${NC}"
    jq -r ".skills[\"$skill\"].promptTriggers.keywords // [] | .[] | if type == \"object\" then \"\(.value) (weight: \(.weight))\" else . end" "$RULES_FILE"
}

get_patterns() {
    local skill="$1"
    if [[ -z "$skill" ]]; then
        echo -e "${RED}Error: Skill name required${NC}"
        exit 1
    fi

    echo -e "${BLUE}Intent patterns for '$skill':${NC}"
    jq -r ".skills[\"$skill\"].promptTriggers.intentPatterns // [] | .[] | if type == \"object\" then \"\(.value) (weight: \(.weight))\" else . end" "$RULES_FILE"
}

# ============== CREATE OPERATIONS ==============

create_skill_minimal() {
    local name="$1"
    local desc="$2"
    local priority="${3:-medium}"

    if [[ -z "$name" || -z "$desc" ]]; then
        echo -e "${RED}Error: Name and description required${NC}"
        echo "Usage: create-minimal <name> <description> [priority]"
        exit 1
    fi

    # Check if skill already exists
    if jq -e ".skills[\"$name\"]" "$RULES_FILE" > /dev/null 2>&1; then
        echo -e "${RED}Error: Skill '$name' already exists${NC}"
        exit 1
    fi

    # Create minimal skill entry
    local tmp_file
    tmp_file=$(mktemp)
    jq --arg name "$name" --arg desc "$desc" --arg priority "$priority" \
        '.skills[$name] = {
            "type": "domain",
            "enforcement": "suggest",
            "priority": $priority,
            "description": $desc,
            "promptTriggers": {
                "keywords": [],
                "intentPatterns": []
            }
        }' "$RULES_FILE" > "$tmp_file"

    mv "$tmp_file" "$RULES_FILE"
    echo -e "${GREEN}Created skill '$name' with priority '$priority'${NC}"
}

# ============== UPDATE OPERATIONS ==============

add_keyword() {
    local skill="$1"
    local keyword="$2"
    local weight="$3"

    if [[ -z "$skill" || -z "$keyword" ]]; then
        echo -e "${RED}Error: Skill name and keyword required${NC}"
        echo "Usage: add-keyword <skill> <keyword> [weight]"
        exit 1
    fi

    # Verify skill exists
    if ! jq -e ".skills[\"$skill\"]" "$RULES_FILE" > /dev/null 2>&1; then
        echo -e "${RED}Error: Skill '$skill' not found${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    if [[ -n "$weight" ]]; then
        # Add weighted keyword object
        jq --arg skill "$skill" --arg kw "$keyword" --argjson weight "$weight" \
            '.skills[$skill].promptTriggers.keywords += [{"value": $kw, "weight": $weight}]' \
            "$RULES_FILE" > "$tmp_file"
        echo -e "${GREEN}Added keyword '$keyword' (weight: $weight) to '$skill'${NC}"
    else
        # Add simple string keyword
        jq --arg skill "$skill" --arg kw "$keyword" \
            '.skills[$skill].promptTriggers.keywords += [$kw]' \
            "$RULES_FILE" > "$tmp_file"
        echo -e "${GREEN}Added keyword '$keyword' to '$skill'${NC}"
    fi

    mv "$tmp_file" "$RULES_FILE"
}

add_pattern() {
    local skill="$1"
    local pattern="$2"
    local weight="$3"

    if [[ -z "$skill" || -z "$pattern" ]]; then
        echo -e "${RED}Error: Skill name and pattern required${NC}"
        echo "Usage: add-pattern <skill> <pattern> [weight]"
        exit 1
    fi

    # Verify skill exists
    if ! jq -e ".skills[\"$skill\"]" "$RULES_FILE" > /dev/null 2>&1; then
        echo -e "${RED}Error: Skill '$skill' not found${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    if [[ -n "$weight" ]]; then
        jq --arg skill "$skill" --arg pat "$pattern" --argjson weight "$weight" \
            '.skills[$skill].promptTriggers.intentPatterns += [{"value": $pat, "weight": $weight}]' \
            "$RULES_FILE" > "$tmp_file"
        echo -e "${GREEN}Added pattern '$pattern' (weight: $weight) to '$skill'${NC}"
    else
        jq --arg skill "$skill" --arg pat "$pattern" \
            '.skills[$skill].promptTriggers.intentPatterns += [$pat]' \
            "$RULES_FILE" > "$tmp_file"
        echo -e "${GREEN}Added pattern '$pattern' to '$skill'${NC}"
    fi

    mv "$tmp_file" "$RULES_FILE"
}

remove_keyword() {
    local skill="$1"
    local keyword="$2"

    if [[ -z "$skill" || -z "$keyword" ]]; then
        echo -e "${RED}Error: Skill name and keyword required${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    # Remove keyword (handles both string and object formats)
    jq --arg skill "$skill" --arg kw "$keyword" \
        '.skills[$skill].promptTriggers.keywords = [.skills[$skill].promptTriggers.keywords[] | select(if type == "object" then .value != $kw else . != $kw end)]' \
        "$RULES_FILE" > "$tmp_file"

    mv "$tmp_file" "$RULES_FILE"
    echo -e "${GREEN}Removed keyword '$keyword' from '$skill'${NC}"
}

remove_pattern() {
    local skill="$1"
    local pattern="$2"

    if [[ -z "$skill" || -z "$pattern" ]]; then
        echo -e "${RED}Error: Skill name and pattern required${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    jq --arg skill "$skill" --arg pat "$pattern" \
        '.skills[$skill].promptTriggers.intentPatterns = [.skills[$skill].promptTriggers.intentPatterns[] | select(if type == "object" then .value != $pat else . != $pat end)]' \
        "$RULES_FILE" > "$tmp_file"

    mv "$tmp_file" "$RULES_FILE"
    echo -e "${GREEN}Removed pattern '$pattern' from '$skill'${NC}"
}

update_priority() {
    local skill="$1"
    local priority="$2"

    if [[ -z "$skill" || -z "$priority" ]]; then
        echo -e "${RED}Error: Skill name and priority required${NC}"
        exit 1
    fi

    if [[ ! "$priority" =~ ^(critical|high|medium|low)$ ]]; then
        echo -e "${RED}Error: Priority must be: critical, high, medium, or low${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    jq --arg skill "$skill" --arg priority "$priority" \
        '.skills[$skill].priority = $priority' \
        "$RULES_FILE" > "$tmp_file"

    mv "$tmp_file" "$RULES_FILE"
    echo -e "${GREEN}Updated '$skill' priority to '$priority'${NC}"
}

update_enforcement() {
    local skill="$1"
    local enforcement="$2"

    if [[ -z "$skill" || -z "$enforcement" ]]; then
        echo -e "${RED}Error: Skill name and enforcement level required${NC}"
        exit 1
    fi

    if [[ ! "$enforcement" =~ ^(suggest|block|warn)$ ]]; then
        echo -e "${RED}Error: Enforcement must be: suggest, block, or warn${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    jq --arg skill "$skill" --arg enf "$enforcement" \
        '.skills[$skill].enforcement = $enf' \
        "$RULES_FILE" > "$tmp_file"

    mv "$tmp_file" "$RULES_FILE"
    echo -e "${GREEN}Updated '$skill' enforcement to '$enforcement'${NC}"
}

update_description() {
    local skill="$1"
    local desc="$2"

    if [[ -z "$skill" || -z "$desc" ]]; then
        echo -e "${RED}Error: Skill name and description required${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    jq --arg skill "$skill" --arg desc "$desc" \
        '.skills[$skill].description = $desc' \
        "$RULES_FILE" > "$tmp_file"

    mv "$tmp_file" "$RULES_FILE"
    echo -e "${GREEN}Updated '$skill' description${NC}"
}

# ============== DELETE OPERATIONS ==============

delete_skill() {
    local skill="$1"

    if [[ -z "$skill" ]]; then
        echo -e "${RED}Error: Skill name required${NC}"
        exit 1
    fi

    # Verify skill exists
    if ! jq -e ".skills[\"$skill\"]" "$RULES_FILE" > /dev/null 2>&1; then
        echo -e "${RED}Error: Skill '$skill' not found${NC}"
        exit 1
    fi

    local tmp_file
    tmp_file=$(mktemp)

    jq --arg skill "$skill" 'del(.skills[$skill])' "$RULES_FILE" > "$tmp_file"

    mv "$tmp_file" "$RULES_FILE"
    echo -e "${GREEN}Deleted skill '$skill'${NC}"
}

# ============== UTILITY OPERATIONS ==============

search_skills() {
    local term="$1"

    if [[ -z "$term" ]]; then
        echo -e "${RED}Error: Search term required${NC}"
        exit 1
    fi

    echo -e "${BLUE}Searching for '$term' across all skills...${NC}"
    echo ""

    # Search in keywords
    echo -e "${YELLOW}Keywords containing '$term':${NC}"
    jq -r --arg term "$term" '
        .skills | to_entries[] |
        select(.value.promptTriggers.keywords != null) |
        {skill: .key, keywords: [.value.promptTriggers.keywords[] |
            if type == "object" then .value else . end |
            select(test($term; "i"))]} |
        select(.keywords | length > 0) |
        "\(.skill): \(.keywords | join(", "))"
    ' "$RULES_FILE"

    echo ""
    echo -e "${YELLOW}Patterns containing '$term':${NC}"
    jq -r --arg term "$term" '
        .skills | to_entries[] |
        select(.value.promptTriggers.intentPatterns != null) |
        {skill: .key, patterns: [.value.promptTriggers.intentPatterns[] |
            if type == "object" then .value else . end |
            select(test($term; "i"))]} |
        select(.patterns | length > 0) |
        "\(.skill): \(.patterns | join(", "))"
    ' "$RULES_FILE"
}

validate_json() {
    if jq empty "$RULES_FILE" 2>/dev/null; then
        echo -e "${GREEN}JSON syntax is valid${NC}"

        # Additional validation
        local skill_count
        skill_count=$(jq '.skills | length' "$RULES_FILE")
        echo -e "${BLUE}Total skills: $skill_count${NC}"
    else
        echo -e "${RED}JSON syntax error!${NC}"
        jq empty "$RULES_FILE"
        exit 1
    fi
}

backup_rules() {
    local timestamp
    timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${RULES_FILE%.json}_backup_${timestamp}.json"

    cp "$RULES_FILE" "$backup_file"
    echo -e "${GREEN}Backup created: $backup_file${NC}"
}

show_stats() {
    echo -e "${BLUE}=== Skill Rules Statistics ===${NC}"
    echo ""

    local total
    total=$(jq '.skills | length' "$RULES_FILE")
    echo -e "Total skills: ${GREEN}$total${NC}"

    echo ""
    echo -e "${YELLOW}By Priority:${NC}"
    jq -r '.skills | to_entries | group_by(.value.priority // "medium") | .[] | "\(.[0].value.priority // "medium"): \(length)"' "$RULES_FILE" | sort

    echo ""
    echo -e "${YELLOW}By Enforcement:${NC}"
    jq -r '.skills | to_entries | group_by(.value.enforcement // "suggest") | .[] | "\(.[0].value.enforcement // "suggest"): \(length)"' "$RULES_FILE" | sort

    echo ""
    echo -e "${YELLOW}Top 5 by Keyword Count:${NC}"
    jq -r '.skills | to_entries | map({name: .key, count: (.value.promptTriggers.keywords // [] | length)}) | sort_by(-.count) | .[0:5][] | "\(.name): \(.count) keywords"' "$RULES_FILE"
}

# ============== MAIN ==============

case "${1:-}" in
    list)
        list_skills
        ;;
    list-full)
        list_skills_full
        ;;
    get)
        get_skill "$2"
        ;;
    get-keywords)
        get_keywords "$2"
        ;;
    get-patterns)
        get_patterns "$2"
        ;;
    create-minimal)
        create_skill_minimal "$2" "$3" "$4"
        ;;
    add-keyword)
        add_keyword "$2" "$3" "$4"
        ;;
    add-pattern)
        add_pattern "$2" "$3" "$4"
        ;;
    remove-keyword)
        remove_keyword "$2" "$3"
        ;;
    remove-pattern)
        remove_pattern "$2" "$3"
        ;;
    update-priority)
        update_priority "$2" "$3"
        ;;
    update-enforcement)
        update_enforcement "$2" "$3"
        ;;
    update-description)
        update_description "$2" "$3"
        ;;
    delete)
        delete_skill "$2"
        ;;
    search)
        search_skills "$2"
        ;;
    validate)
        validate_json
        ;;
    backup)
        backup_rules
        ;;
    stats)
        show_stats
        ;;
    -h|--help|help|"")
        usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        usage
        exit 1
        ;;
esac
