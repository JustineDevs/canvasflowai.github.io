#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
FEATURE_JSON="$ROOT/.specify/feature.json"
FEATURE_DIR_REL="$(sed -n 's/.*"feature_directory"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$FEATURE_JSON")"
FEATURE_DIR="$ROOT/$FEATURE_DIR_REL"

DOCS=()
for file in plan.md spec.md research.md data-model.md quickstart.md; do
  [[ -f "$FEATURE_DIR/$file" ]] && DOCS+=("$file")
done
[[ -d "$FEATURE_DIR/contracts" ]] && DOCS+=("contracts/")

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
  "TASKS_TEMPLATE": "$ROOT/.specify/templates/tasks-template.md",
  "AVAILABLE_DOCS": [${json_docs}]
}
JSON
