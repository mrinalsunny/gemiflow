---
name: discover-plugins
description: Discover and recommend gemiflow plugins based on your workflow, installed MCP tools, and current task
argument-hint: "[search-query]"
allowed-tools: mcp__gemiflow__transfer_plugin-search mcp__gemiflow__transfer_plugin-info mcp__gemiflow__transfer_plugin-featured mcp__gemiflow__transfer_plugin-official mcp__gemiflow__transfer_store-search mcp__gemiflow__transfer_store-featured mcp__gemiflow__transfer_store-trending mcp__gemiflow__transfer_store-info mcp__gemiflow__guidance_discover mcp__gemiflow__guidance_recommend mcp__gemiflow__guidance_capabilities mcp__gemiflow__mcp_status Bash Read
---

# Discover Plugins

Find and recommend gemiflow plugins for your workflow.

## When to use

When starting a new project, exploring gemiflow capabilities, or wondering which plugins would help with your current task.

## Steps

1. **Check installed** — run `ls plugins/` to see what's already installed
2. **Browse marketplace** — call `mcp__gemiflow__transfer_plugin-featured` for recommended plugins
3. **Search by need** — call `mcp__gemiflow__transfer_plugin-search` with keywords matching your task
4. **Get recommendations** — call `mcp__gemiflow__guidance_recommend` with your current task description for personalized suggestions
5. **Check capabilities** — call `mcp__gemiflow__guidance_capabilities` to see what each plugin enables
6. **Show details** — call `mcp__gemiflow__transfer_plugin-info` for full plugin details

## Plugin Catalog (32 plugins)

### Core & Coordination — Start here

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **gemiflow-core** | Always — base layer for all GemiFlow work | MCP server, status, doctor, coder/researcher/reviewer agents |
| **gemiflow-swarm** | Multi-agent tasks (3+ files, features, refactors) | Swarm topologies (hierarchical, mesh), Monitor streaming, worktree isolation |
| **gemiflow-autopilot** | Autonomous task completion without manual steering | /loop-based autonomous execution, progress prediction, learning |
| **gemiflow-loop-workers** | Recurring background work (audits, optimization, mapping) | 12 background workers via /loop or CronCreate scheduling |
| **gemiflow-workflows** | Repeatable multi-step processes | Workflow templates, parallel execution, conditional branching |

### Memory & Intelligence — Cross-session learning

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **gemiflow-agentdb** | Semantic search over code patterns, telemetry, decisions | AgentDB with HNSW vector search (150x-12,500x faster), RuVector embeddings |
| **gemiflow-rag-memory** | Simple key-value memory with search | Store/search/recall without full AgentDB setup |
| **gemiflow-rvf** | Portable memory export/import across machines | RVF format, session persistence, cross-platform transfer |
| **gemiflow-ruvector** | Vector embedding operations, HNSW indexing, clustering | ONNX 384-dim embeddings, hyperbolic Poincare ball, k-means/DBSCAN clustering |
| **gemiflow-knowledge-graph** | Entity extraction, relation mapping, graph traversal | Pathfinder algo on AgentDB causal edges, code entity graphs |
| **gemiflow-intelligence** | Task routing optimization, learning from outcomes | SONA neural patterns, trajectory learning, model routing with confidence |
| **gemiflow-daa** | Self-adapting agents that evolve behavior | Dynamic Agentic Architecture, cognitive patterns, knowledge sharing |

### Architecture & Methodology — Build right

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **gemiflow-adr** | Document architecture decisions, check compliance | ADR create/index/supersede, code-to-ADR linking, compliance checking on diffs |
| **gemiflow-ddd** | Domain modeling, bounded context scaffolding | Context wizard, aggregate roots, domain events, anti-corruption layers, boundary validation |
| **gemiflow-sparc** | Structured development methodology | Specification-Pseudocode-Architecture-Refinement-Completion with quality gates |

### Quality & Security — Ship safely

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **gemiflow-security-audit** | Before merging, after dependency changes | CVE scanning, dependency vulnerability checks, security reports |
| **gemiflow-aidefence** | Processing user input, handling untrusted data | Prompt injection detection, PII scanning, adversarial defense |
| **gemiflow-testgen** | After implementing features, during refactors | Test gap detection, TDD London School workflow, coverage routing |
| **gemiflow-browser** | UI testing, web scraping, visual validation | Playwright automation — navigate, click, screenshot, validate |

### Development Tools — Build faster

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **gemiflow-jujutsu** | PR review, merge decisions, diff risk scoring | Diff analysis, risk classification, reviewer recommendations |
| **gemiflow-docs** | After API changes, before releases | Doc generation, drift detection, API documentation |
| **gemiflow-ruvllm** | Local LLM inference, custom model configs | RuVLLM integration, MicroLoRA fine-tuning, chat formatting |
| **gemiflow-agent** | Sandboxed code execution, untrusted workloads | WASM agent sandboxing, community gallery |
| **gemiflow-plugin-creator** | Building new gemiflow plugins | Scaffold structure, validate frontmatter, test MCP references |
| **gemiflow-migrations** | Database schema changes | Sequential migration numbering, up/down pairs, dry-run, rollback validation |
| **gemiflow-observability** | Logging, tracing, metrics correlation | Structured JSON logging, distributed tracing, agent-to-app telemetry correlation |
| **gemiflow-cost-tracker** | Token budget management | Per-agent cost attribution, model pricing, budget alerts, optimization recommendations |

### Domain-Specific — Specialized workloads

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **gemiflow-goals** | Long-horizon planning, multi-session research | GOAP algorithm, deep research orchestration, horizon tracking, synthesis |
| **gemiflow-federation** | Cross-installation agent coordination | Zero-trust peer discovery, mTLS auth, consensus routing, compliance audit |
| **gemiflow-iot-cognitum** | Cognitum Seed hardware device management | 5-tier device trust, telemetry anomaly detection (Z-score), fleet firmware rollouts, witness chain verification, SONA + AgentDB integration |
| **gemiflow-neural-trader** | Trading strategy development and backtesting | Z-score market anomalies, SONA trajectory strategies, walk-forward backtesting, portfolio optimization |
| **gemiflow-market-data** | Market data ingestion and pattern matching | OHLCV vectorization, candlestick pattern detection, HNSW-indexed historical search |

## Decision Guide

**"I need to..."** → Use this plugin:

- Build a feature → `gemiflow-core` + `gemiflow-swarm` + `gemiflow-testgen`
- Fix a bug → `gemiflow-core` + `gemiflow-jujutsu` (for diff analysis)
- Audit security → `gemiflow-security-audit` + `gemiflow-aidefence`
- Run background tasks → `gemiflow-loop-workers` + `gemiflow-autopilot`
- Search past decisions → `gemiflow-agentdb` + `gemiflow-rag-memory`
- Plan a multi-week effort → `gemiflow-goals` (horizon tracking)
- Manage IoT devices → `gemiflow-iot-cognitum`
- Coordinate remote agents → `gemiflow-federation`
- Test UI changes → `gemiflow-browser`
- Generate docs → `gemiflow-docs`
- Create a new plugin → `gemiflow-plugin-creator`
- Document architecture decisions → `gemiflow-adr`
- Scaffold domain models → `gemiflow-ddd`
- Follow SPARC methodology → `gemiflow-sparc`
- Develop trading strategies → `gemiflow-neural-trader` + `gemiflow-market-data`
- Work with vector embeddings → `gemiflow-ruvector`
- Build knowledge graphs → `gemiflow-knowledge-graph`
- Manage database migrations → `gemiflow-migrations`
- Add observability → `gemiflow-observability`
- Track token costs → `gemiflow-cost-tracker`

## Install any plugin

```
/plugin marketplace add ruvnet/gemiflow
/plugin install <plugin-name>@gemiflow
```
