#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
FEATURE_JSON="$ROOT/.specify/feature.json"
FEATURE_DIR_REL="$(sed -n 's/.*"feature_directory"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$FEATURE_JSON")"
FEATURE_DIR="$ROOT/$FEATURE_DIR_REL"

cat <<JSON
{
  "FEATURE_SPEC": "$FEATURE_DIR/spec.md",
  "IMPL_PLAN": "$FEATURE_DIR/plan.md",
  "SPECS_DIR": "$ROOT/specs",
  "BRANCH": "local/canvasflow-mvp"
}
JSON
