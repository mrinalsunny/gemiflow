---
layout: default
title: GemiFlow Marketplace
description: Claude Code native agents, swarms, workers, and MCP tools for continuous software engineering
---

# GemiFlow Marketplace

**Installable agentic workflows for Claude Code -- not just commands.**

GemiFlow provides native Claude Code plugins for multi-agent orchestration, /loop workers, security auditing, memory-powered RAG, and test generation.

## Quick Install

```bash
# Add the marketplace
/plugin marketplace add ruvnet/gemiflow

# Install plugins
/plugin install gemiflow-core@gemiflow
/plugin install gemiflow-swarm@gemiflow
/plugin install gemiflow-loop-workers@gemiflow
```

## Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| **gemiflow-core** | MCP server, base commands, project config | `/plugin install gemiflow-core@gemiflow` |
| **gemiflow-swarm** | Teams, agents, Monitor streams, worktree isolation | `/plugin install gemiflow-swarm@gemiflow` |
| **gemiflow-loop-workers** | /loop workers, CronCreate, cache-aware scheduling | `/plugin install gemiflow-loop-workers@gemiflow` |
| **gemiflow-security-audit** | Security review, dependency checks, policy gates | `/plugin install gemiflow-security-audit@gemiflow` |
| **gemiflow-rag-memory** | RuVector memory, HNSW search, AgentDB | `/plugin install gemiflow-rag-memory@gemiflow` |
| **gemiflow-testgen** | Test gap detection, coverage analysis, TDD workflow | `/plugin install gemiflow-testgen@gemiflow` |
| **gemiflow-docs** | Doc generation, drift detection, API docs | `/plugin install gemiflow-docs@gemiflow` |
| **gemiflow-autopilot** | Autonomous /loop completion, learning, prediction | `/plugin install gemiflow-autopilot@gemiflow` |
| **gemiflow-intelligence** | Self-learning SONA patterns, trajectory learning, routing | `/plugin install gemiflow-intelligence@gemiflow` |
| **gemiflow-agentdb** | AgentDB controllers, HNSW vector search, RuVector | `/plugin install gemiflow-agentdb@gemiflow` |
| **gemiflow-aidefence** | AI safety scanning, PII detection, prompt defense | `/plugin install gemiflow-aidefence@gemiflow` |
| **gemiflow-browser** | Playwright browser automation, testing, scraping | `/plugin install gemiflow-browser@gemiflow` |
| **gemiflow-jujutsu** | Git diff analysis, risk scoring, reviewer recs | `/plugin install gemiflow-jujutsu@gemiflow` |
| **gemiflow-agent** | Sandboxed WASM agents and gallery sharing | `/plugin install gemiflow-agent@gemiflow` |
| **gemiflow-workflows** | Workflow templates, orchestration, lifecycle | `/plugin install gemiflow-workflows@gemiflow` |
| **gemiflow-daa** | Dynamic Agentic Architecture, cognitive patterns | `/plugin install gemiflow-daa@gemiflow` |
| **gemiflow-ruvllm** | Local LLM inference, MicroLoRA, chat formatting | `/plugin install gemiflow-ruvllm@gemiflow` |
| **gemiflow-rvf** | RVF portable memory, session persistence | `/plugin install gemiflow-rvf@gemiflow` |
| **gemiflow-plugin-creator** | Scaffold, validate, publish new plugins | `/plugin install gemiflow-plugin-creator@gemiflow` |

## How It Works

GemiFlow plugins extend Claude Code with:
- **Skills** -- Teach Claude Code new workflows (swarm init, /loop workers, security scans)
- **Commands** -- Slash commands for common operations (/status, /audit, /memory)
- **Agents** -- Specialized agent definitions (coder, reviewer, architect, security-auditor)
- **MCP Server** -- 314 tools for coordination, memory, neural learning, and more

## Claude Code Native Integration

GemiFlow plugins use Claude Code's native capabilities when available:

| Feature | Plugin | Claude Code Native |
|---------|--------|--------------------|
| Periodic workers | gemiflow-loop-workers | `/loop` + `ScheduleWakeup` |
| Live monitoring | gemiflow-swarm | `Monitor` tool |
| Background jobs | gemiflow-loop-workers | `CronCreate` |
| Agent isolation | gemiflow-swarm | `isolation: "worktree"` |
| Multi-agent comms | gemiflow-swarm | `TeamCreate` + `SendMessage` |
| Cross-session | gemiflow-core | `PushNotification` + `RemoteTrigger` |
| Autonomous loops | gemiflow-autopilot | `/loop` + `ScheduleWakeup` + autopilot MCP |

## Trust & Security

- All plugins are open source -- review before installing
- MCP servers run locally, no data leaves your machine
- Plugins declare required permissions in their manifest
- Pin versions for production use: `/plugin install gemiflow-core@0.1.0@gemiflow`
- Security scanning available via gemiflow-security-audit
- Cryptographically-signed [witness manifest](../verification.md) attests every documented fix; see [Validation System](validation/) for the three-layer regression-protection stack

## Links

- [GitHub Repository](https://github.com/ruvnet/gemiflow)
- [npm Packages](https://www.npmjs.com/package/@gemiflow/cli)
- [ADR-091: Native Integration](https://github.com/ruvnet/gemiflow/blob/main/v3/docs/adr/ADR-091-loop-monitor-native-integration.md)
- [Issues & Support](https://github.com/ruvnet/gemiflow/issues)
