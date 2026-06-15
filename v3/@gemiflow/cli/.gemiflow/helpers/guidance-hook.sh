#!/bin/bash
# Capture hook guidance for Claude visibility
GUIDANCE_FILE=".gemiflow/last-guidance.txt"
mkdir -p .gemiflow

case "$1" in
  "route")
    npx agentic-flow@alpha hooks route "$2" 2>&1 | tee "$GUIDANCE_FILE"
    ;;
  "pre-edit")
    npx agentic-flow@alpha hooks pre-edit "$2" 2>&1 | tee "$GUIDANCE_FILE"
    ;;
esac
