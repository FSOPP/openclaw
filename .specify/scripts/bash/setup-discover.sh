#!/usr/bin/env bash

set -e

# Parse command line arguments
JSON_MODE=false
ARGS=()

for arg in "$@"; do
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --help|-h)
            echo "Usage: $0 [--json] [--help] [TARGET_PATH]"
            echo ""
            echo "Resolve paths and validate environment for /speckit.discover."
            echo ""
            echo "Arguments:"
            echo "  TARGET_PATH   Path to project directory to analyze (default: repo root)"
            echo ""
            echo "Options:"
            echo "  --json        Output result as JSON instead of human-readable text"
            echo "  --help, -h    Show this help message and exit"
            exit 0
            ;;
        *)
            ARGS+=("$arg")
            ;;
    esac
done

# Get script directory and load common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Get all paths and variables from common functions
eval $(get_feature_paths)

# Check if we're on a proper feature branch (only for git repos)
check_feature_branch "$CURRENT_BRANCH" "$HAS_GIT" || exit 1

# Ensure the feature directory exists
mkdir -p "$FEATURE_DIR"

# Resolve TARGET_PATH: use first positional arg or default to repo root
if [[ ${#ARGS[@]} -gt 0 ]]; then
    RAW_TARGET="${ARGS[0]}"

    # Resolve relative paths against repo root
    if [[ "$RAW_TARGET" != /* ]]; then
        RAW_TARGET="$REPO_ROOT/$RAW_TARGET"
    fi

    # Validate target path exists
    if [[ ! -e "$RAW_TARGET" ]]; then
        echo "ERROR: Target path does not exist: ${ARGS[0]}" >&2
        exit 1
    fi

    # Validate target path is a directory
    if [[ ! -d "$RAW_TARGET" ]]; then
        echo "ERROR: Target path is not a directory: ${ARGS[0]}" >&2
        exit 1
    fi

    # Resolve to absolute path
    TARGET_PATH="$(cd "$RAW_TARGET" && pwd)"
else
    TARGET_PATH="$REPO_ROOT"
fi

# Resolve spec template path
SPEC_TEMPLATE="$REPO_ROOT/.specify/templates/spec-template.md"

# Check if spec.md already exists
SPEC_EXISTS="false"
if [[ -f "$FEATURE_SPEC" ]]; then
    SPEC_EXISTS="true"
    echo "[specify] Warning: spec.md already exists at $FEATURE_SPEC" >&2
fi

# Output results
if $JSON_MODE; then
    printf '{"FEATURE_DIR":"%s","SPEC_FILE":"%s","SPEC_TEMPLATE":"%s","TARGET_PATH":"%s","SPEC_EXISTS":"%s","BRANCH":"%s","HAS_GIT":"%s"}\n' \
        "$FEATURE_DIR" "$FEATURE_SPEC" "$SPEC_TEMPLATE" "$TARGET_PATH" "$SPEC_EXISTS" "$CURRENT_BRANCH" "$HAS_GIT"
else
    echo "Feature dir: $FEATURE_DIR"
    echo "Spec file: $FEATURE_SPEC"
    echo "Spec template: $SPEC_TEMPLATE"
    echo "Target path: $TARGET_PATH"
    echo "Spec exists: $SPEC_EXISTS"
    echo "Branch: $CURRENT_BRANCH"
    echo "Has git: $HAS_GIT"
fi
