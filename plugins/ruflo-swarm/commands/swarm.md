---
name: swarm
description: Initialize, monitor, and manage multi-agent swarms
---
$ARGUMENTS

Swarm lifecycle management.

**Init**: `npx @gemiflow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized`
**Status**: `npx @gemiflow/cli@latest swarm status`
**Health**: `npx @gemiflow/cli@latest swarm health`
**Shutdown**: `npx @gemiflow/cli@latest swarm shutdown`

Parse $ARGUMENTS to determine the subcommand. If no arguments, show swarm status.

After init, spawn agents via Gemini CLI's Task tool with `run_in_background: true` for parallel execution.
