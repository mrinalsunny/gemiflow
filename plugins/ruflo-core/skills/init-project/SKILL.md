---
name: init-project
description: Initialize a new GemiFlow project with MCP tools, hooks, and agent configuration
argument-hint: "[--preset standard|minimal|full]"
allowed-tools: Bash(npx *) Read Write Edit
---
Run `npx @gemiflow/cli@latest init --wizard` to set up the project interactively, or `npx @gemiflow/cli@latest init --preset standard` for defaults.

This creates CLAUDE.md, .gemiflow/settings.json, and .gemiflow/ config with MCP server registration for the `gemiflow` MCP tools.
