#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
FEATURE_JSON="$ROOT/.specify/feature.json"

if [[ ! -f "$FEATURE_JSON" ]]; then
  echo '{"error":"feature-not-selected"}'
  exit 1
fi

FEATURE_DIR_REL="$(sed -n 's/.*"feature_directory"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$FEATURE_JSON")"
if [[ -z "${FEATURE_DIR_REL:-}" ]]; then
  echo '{"error":"feature-directory-missing"}'
  exit 1
fi

FEATURE_DIR="$ROOT/$FEATURE_DIR_REL"
SPEC="$FEATURE_DIR/spec.md"
PLAN="$FEATURE_DIR/plan.md"
TASKS="$FEATURE_DIR/tasks.md"

DOCS=()
[[ -f "$SPEC" ]] && DOCS+=("spec.md")
[[ -f "$PLAN" ]] && DOCS+=("plan.md")
[[ -f "$TASKS" ]] && DOCS+=("tasks.md")
[[ -f "$FEATURE_DIR/research.md" ]] && DOCS+=("research.md")
[[ -f "$FEATURE_DIR/data-model.md" ]] && DOCS+=("data-model.md")
[[ -d "$FEATURE_DIR/contracts" ]] && DOCS+=("contracts/")
[[ -f "$FEATURE_DIR/quickstart.md" ]] && DOCS+=("quickstart.md")

json_docs=""
for doc in "${DOCS[@]:-}"; do
  [[ -n "$doc" ]] || continue
  if [[ -n "$json_docs" ]]; then
    json_docs+=", "
  fi
  json_docs+="\"$doc\""
done

cat <<JSON
{
  "FEATURE_DIR": "$FEATURE_DIR",
  "FEATURE_SPEC": "$SPEC",
  "IMPL_PLAN": "$PLAN",
  "TASKS": "$TASKS",
  "AVAILABLE_DOCS": [${json_docs}]
}
JSON
