---
name: gemiflow-doctor
description: Run health checks on the GemiFlow installation and fix common issues
argument-hint: "[--fix]"
allowed-tools: Bash(npx *)
---
Run `npx @gemiflow/cli@latest doctor --fix` to diagnose and auto-repair common issues.

Checks: Node.js 20+, npm 9+, git, config validity, daemon status, memory database, API keys, MCP servers, disk space, TypeScript.

Targeted fixes:
- Memory: `npx @gemiflow/cli@latest memory init --force`
- Daemon: `npx @gemiflow/cli@latest daemon start`
- Config: `npx @gemiflow/cli@latest config reset`
