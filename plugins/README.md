# GemiFlow Plugins

32 Claude Code plugins for agent-powered development workflows. Load with `--plugin-dir`.

## Quick Start

```bash
# Load specific plugins
claude --plugin-dir plugins/gemiflow-core --plugin-dir plugins/gemiflow-swarm

# Load all plugins
claude $(ls -d plugins/gemiflow-*/ | sed 's|^|--plugin-dir |' | tr '\n' ' ')
```

## Plugin Catalog

### Core & Coordination

| Plugin | Description |
|--------|-------------|
| [gemiflow-core](gemiflow-core/) | MCP server, status, doctor, coder/researcher/reviewer agents |
| [gemiflow-swarm](gemiflow-swarm/) | Swarm topologies (hierarchical, mesh), Monitor streaming |
| [gemiflow-autopilot](gemiflow-autopilot/) | Autonomous /loop task completion with prediction |
| [gemiflow-loop-workers](gemiflow-loop-workers/) | 12 background workers via /loop or CronCreate |
| [gemiflow-workflows](gemiflow-workflows/) | Workflow templates, parallel execution, branching |

### Memory & Intelligence

| Plugin | Description |
|--------|-------------|
| [gemiflow-agentdb](gemiflow-agentdb/) | AgentDB with HNSW vector search (150x-12,500x faster) |
| [gemiflow-rag-memory](gemiflow-rag-memory/) | SOTA RAG — hybrid search, Graph RAG, MMR diversity, memory bridge |
| [gemiflow-rvf](gemiflow-rvf/) | Portable RVF memory format, session persistence |
| [gemiflow-ruvector](gemiflow-ruvector/) | [`ruvector`](https://npmjs.com/package/ruvector) — FlashAttention-3, Graph RAG, hybrid search, 103 MCP tools, Brain AGI |
| [gemiflow-knowledge-graph](gemiflow-knowledge-graph/) | Entity extraction, relation mapping, pathfinder traversal |
| [gemiflow-intelligence](gemiflow-intelligence/) | SONA neural patterns, trajectory learning, model routing |
| [gemiflow-daa](gemiflow-daa/) | Dynamic Agentic Architecture, cognitive patterns |

### Architecture & Methodology

| Plugin | Description |
|--------|-------------|
| [gemiflow-adr](gemiflow-adr/) | ADR lifecycle — create, index, supersede, compliance checking |
| [gemiflow-ddd](gemiflow-ddd/) | DDD scaffolding — bounded contexts, aggregates, domain events |
| [gemiflow-sparc](gemiflow-sparc/) | SPARC methodology with 5 phases and quality gates |

### Quality & Security

| Plugin | Description |
|--------|-------------|
| [gemiflow-security-audit](gemiflow-security-audit/) | CVE scanning, dependency vulnerability checks |
| [gemiflow-aidefence](gemiflow-aidefence/) | Prompt injection detection, PII scanning |
| [gemiflow-testgen](gemiflow-testgen/) | Test gap detection, TDD London School workflow |
| [gemiflow-browser](gemiflow-browser/) | Playwright browser automation and testing |

### Development Tools

| Plugin | Description |
|--------|-------------|
| [gemiflow-jujutsu](gemiflow-jujutsu/) | Diff analysis, risk scoring, reviewer recommendations |
| [gemiflow-docs](gemiflow-docs/) | Doc generation, drift detection, API docs |
| [gemiflow-ruvllm](gemiflow-ruvllm/) | Local LLM inference, MicroLoRA, chat formatting |
| [gemiflow-agent](gemiflow-agent/) | WASM agent sandboxing and gallery |
| [gemiflow-plugin-creator](gemiflow-plugin-creator/) | Scaffold and validate new plugins |
| [gemiflow-migrations](gemiflow-migrations/) | Database schema migration management |
| [gemiflow-observability](gemiflow-observability/) | Structured logging, tracing, metrics correlation |
| [gemiflow-cost-tracker](gemiflow-cost-tracker/) | Token usage tracking, budget alerts, cost optimization |

### Domain-Specific

| Plugin | Description |
|--------|-------------|
| [gemiflow-goals](gemiflow-goals/) | GOAP planning, deep research, horizon tracking |
| [gemiflow-federation](gemiflow-federation/) | Zero-trust cross-installation agent federation |
| [gemiflow-iot-cognitum](gemiflow-iot-cognitum/) | Cognitum Seed IoT — trust scoring, anomaly detection, fleet management |
| [gemiflow-neural-trader](gemiflow-neural-trader/) | [`neural-trader`](https://npmjs.com/package/neural-trader) — 4 agents, LSTM/Transformer, Rust/NAPI backtesting, 112+ MCP tools |
| [gemiflow-market-data](gemiflow-market-data/) | Market data ingestion, OHLCV vectorization, pattern matching |

## Recommended Stacks

| Use Case | Plugins |
|----------|---------|
| Feature development | `gemiflow-core` + `gemiflow-swarm` + `gemiflow-testgen` + `gemiflow-ddd` |
| Security audit | `gemiflow-core` + `gemiflow-security-audit` + `gemiflow-aidefence` |
| Architecture work | `gemiflow-core` + `gemiflow-adr` + `gemiflow-ddd` + `gemiflow-sparc` |
| Deep research | `gemiflow-core` + `gemiflow-goals` + `gemiflow-rag-memory` + `gemiflow-intelligence` |
| Vector search | `gemiflow-core` + `gemiflow-ruvector` + `gemiflow-rag-memory` + `gemiflow-knowledge-graph` |
| IoT development | `gemiflow-core` + `gemiflow-iot-cognitum` + `gemiflow-agentdb` |
| Trading systems | `gemiflow-core` + `gemiflow-neural-trader` + `gemiflow-market-data` + `gemiflow-ruvector` |
| Full stack | All 32 plugins |

## npm Package Integration

Several plugins wrap standalone npm packages for deeper functionality:

| Plugin | npm Package | What It Adds |
|--------|------------|-------------|
| `gemiflow-neural-trader` | [`neural-trader`](https://npmjs.com/package/neural-trader) | 112+ MCP tools, Rust/NAPI engine, LSTM/Transformer models |
| `gemiflow-ruvector` | [`ruvector`](https://npmjs.com/package/ruvector) | 103 MCP tools, FlashAttention-3, Graph RAG, Brain AGI |

```bash
# Install backing packages
npm install neural-trader ruvector

# Add as MCP servers (optional, for direct tool access)
claude mcp add neural-trader -- npx neural-trader mcp start
claude mcp add ruvector -- npx ruvector mcp start
```

## Plugin Structure

Each plugin follows the Claude Code plugin specification:

```
gemiflow-<name>/
  .claude-plugin/plugin.json    # Plugin manifest
  agents/<name>.md              # Agent definitions (frontmatter: name, description, model)
  commands/<name>.md            # CLI command mappings
  skills/<name>/SKILL.md        # Interactive skills (frontmatter: name, description, argument-hint, allowed-tools)
  README.md                     # Plugin documentation
```

## Creating a Plugin

```bash
claude --plugin-dir plugins/gemiflow-plugin-creator
# Then: /create-plugin my-new-plugin
```

Or manually: copy any existing plugin directory and modify.

## Validation

```bash
claude plugin validate plugins/gemiflow-<name>
```

## Verification & Discoverability

Every MCP tool description across the 32 plugins must answer "use this over native (Bash/Read/Grep/Glob/Task/TodoWrite) when?" per [ADR-112](../v3/docs/adr/ADR-112-mcp-tool-discoverability.md). The rule is enforced by CI:

```bash
# Run the audit (scans all MCPTool definitions across all plugins)
node scripts/audit-tool-descriptions.mjs

# Gates: every description must include "Use when …" guidance,
# be ≥ 80 chars, and be unique. Baseline at verification/mcp-tool-baseline.json
# is monotone-decreasing — CI fails on any regression.
```

Combined with [`verification/`](../verification/) (Ed25519-signed witness manifest, 103+ documented fixes attested), the plugin surface is regression-protected at three layers: install smoke (`npm i`), behavioral smoke (paired-tool round-trips), and presence attestation (every load-bearing line of every documented fix). See [`verification/README.md`](../verification/README.md) for the full stack.

## License

MIT
