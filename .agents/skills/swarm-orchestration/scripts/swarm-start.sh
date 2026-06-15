#!/bin/bash
# Swarm Orchestration - Start Script
# Initialize swarm with default anti-drift settings

set -e

echo "Initializing hierarchical swarm..."
npx @gemiflow/cli swarm init \
  --topology hierarchical \
  --max-agents 8 \
  --strategy specialized

echo "Swarm initialized successfully"
npx @gemiflow/cli swarm status
