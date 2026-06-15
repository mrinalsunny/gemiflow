# ADR-027: OpenAI gemini Integration

## Status
**Proposed** | 2026-02-07

## Branding Note

This ADR introduces the **coflow** branding transition:
- Package: `@gemiflow/gemini` (npm)
- Future umbrella: `coflow` (npm/npx coflow)
- Current umbrella: `gemiflow` (maintained for compatibility)

The gemini integration is the first step in the coflow rebranding initiative.

## Context

### The Agentic Coding Landscape

The agentic coding tool landscape has evolved into two major platforms:

1. **Gemini CLI** (google) - CLI tool using CLAUDE.md for project instructions
2. **OpenAI gemini** (OpenAI) - CLI tool using AGENTS.md for project instructions

Both tools share similar concepts but with different implementations:

| Concept | Gemini CLI | OpenAI gemini |
|---------|-------------|--------------|
| Project Instructions | `CLAUDE.md` | `AGENTS.md` |
| Nested Instructions | `CLAUDE.local.md` | `AGENTS.override.md` |
| Skills | `.gemiflow/skills/` | `.agents/skills/` + `SKILL.md` |
| Configuration | `.gemiflow/settings.json` | `~/.gemini/config.toml` |
| MCP Integration | `.mcp.json` | `config.toml [mcp_servers]` |
| Agent Types | Task tool with subagent_type | Agents SDK integration |
| Automation | Hooks system | Automations (scheduled tasks) |
| Session Management | Session persistence | `gemini resume`, `gemini fork` |
| Non-interactive | `claude -p` | `gemini exec` |
| Approval Modes | Permission modes | Approval policies |
| Sandbox | Sandboxing settings | Sandbox modes (read-only, workspace-write, full-access) |

### Research Findings

#### AGENTS.md Specification

AGENTS.md is an open standard managed by the [Agentic AI Foundation](https://agents.md/) under the Linux Foundation. Key characteristics:

- **Discovery Precedence**: Global (`~/.gemini/AGENTS.md`) → Project root → Current directory
- **Override Mechanism**: `AGENTS.override.md` takes precedence over `AGENTS.md`
- **Byte Limit**: Default 32 KiB combined instruction size (`project_doc_max_bytes`)
- **Fallback Filenames**: Configurable via `project_doc_fallback_filenames`
- **Monorepo Support**: Nested AGENTS.md files per package/directory

#### Skills System

gemini Skills follow the [Open Agent Skills Specification](https://developers.openai.com/gemini/skills):

```
my-skill/
├── SKILL.md                 # Required: instructions + metadata
├── scripts/                 # Optional: executable code
├── references/              # Optional: documentation
├── assets/                  # Optional: templates, resources
└── agents/
    └── openai.yaml         # Optional: UI config and dependencies
```

SKILL.md format:
```yaml
---
name: skill-name
description: When this skill should and should not trigger.
---

Skill instructions for gemini to follow.
```

**Progressive Disclosure**: gemini loads only skill metadata initially, full instructions load on-demand.

**Skill Locations**:
| Scope | Path |
|-------|------|
| Repository (CWD) | `.agents/skills` |
| Repository (Root) | `$REPO_ROOT/.agents/skills` |
| User | `$HOME/.agents/skills` |
| Admin | `/etc/gemini/skills` |
| System | Bundled with gemini |

#### Config.toml Configuration

gemini configuration is TOML-based with extensive options:

```toml
# Core settings
model = "gpt-5.3-gemini"
approval_policy = "on-request"  # untrusted | on-failure | on-request | never
sandbox_mode = "workspace-write"  # read-only | workspace-write | danger-full-access
web_search = "cached"  # disabled | cached | live

# Features
[features]
shell_snapshot = true
child_agents_md = true

# MCP servers
[mcp_servers.my-server]
command = "npx"
args = ["my-mcp-server"]
enabled = true

# Profiles for different workflows
[profiles.dev]
approval_policy = "never"
sandbox_mode = "danger-full-access"
```

#### Automations

gemini Automations enable scheduled background tasks:
- Run on configurable schedules
- Combine with skills via `$skill-name` syntax
- Results appear in triage inbox
- Respect sandbox settings

#### Agents SDK Integration

gemini can run as an MCP server for multi-agent orchestration:
```bash
gemini mcp-server
```

Exposes tools: `gemini` (start session) and `gemini-reply` (continue session).

## Decision

We will create a **parallel gemini integration** in gemiflow that:

1. **Adds `init --gemini` flag** to generate gemini-compatible configuration
2. **Generates AGENTS.md** instead of/alongside CLAUDE.md
3. **Creates `.agents/skills/`** with SKILL.md format skills
4. **Generates `config.toml`** for gemini settings
5. **Maps gemiflow concepts** to gemini equivalents
6. **Supports dual-mode** projects (both Gemini CLI and gemini)

### Architecture

```
gemiflow init --gemini
├── AGENTS.md                    # Project instructions (gemini format)
├── .agents/
│   ├── skills/                  # Skills directory
│   │   ├── swarm-orchestration/
│   │   │   ├── SKILL.md
│   │   │   ├── scripts/
│   │   │   └── references/
│   │   ├── memory-management/
│   │   ├── sparc-methodology/
│   │   └── ...
│   └── config.toml             # Project-level gemini config
├── .gemini/                      # Local overrides (gitignored)
│   ├── config.toml             # User config overrides
│   └── AGENTS.override.md      # Local instruction overrides
└── .gemiflow/                # Runtime (shared between both)
    ├── config.yaml
    └── data/
```

### Mapping Table

| gemiflow Concept | Gemini CLI Output | gemini Output |
|---------------------|-------------------|--------------|
| Project instructions | `CLAUDE.md` | `AGENTS.md` |
| Local overrides | `CLAUDE.local.md` | `AGENTS.override.md` |
| Skills directory | `.gemiflow/skills/` | `.agents/skills/` |
| Skill format | `skill-name.md` (YAML frontmatter) | `skill-name/SKILL.md` |
| Settings | `.gemiflow/settings.json` | `.agents/config.toml` |
| MCP config | `.mcp.json` | `config.toml [mcp_servers]` |
| Hooks | `settings.json` hooks | Automations |
| Agent definitions | `.gemiflow/agents/` | Skills with agent-specific SKILL.md |

### Command-Line Interface

```bash
# Initialize for gemini only
gemiflow init --gemini

# Initialize for both platforms (dual-mode)
gemiflow init --dual

# Initialize with wizard (auto-detects or asks)
gemiflow init wizard

# Convert existing Gemini CLI setup to gemini
gemiflow init --gemini --from-claude

# Convert existing gemini setup to Gemini CLI
gemiflow init --from-gemini
```

### Generated AGENTS.md Structure

```markdown
# GemiFlow V3

## Project Overview
[Auto-detected project description]

## Quick Start
[Build and test commands]

## Agent Coordination

### Swarm Configuration
- Topology: hierarchical
- Max Agents: 8
- Strategy: specialized

### Available Skills
Use `$skill-name` to invoke:
- `$swarm-orchestration` - Multi-agent coordination
- `$memory-management` - AgentDB integration
- `$sparc-methodology` - SPARC development workflow

## Code Standards
[From CLAUDE.md Code Quality Rules]

## Security
- Never commit secrets
- Input validation at boundaries
- Path traversal prevention

## Performance Targets
[From V3 performance targets]
```

### Generated SKILL.md Example

```yaml
---
name: swarm-orchestration
description: >
  Use when coordinating multiple agents for complex tasks.
  Triggers for: multi-file changes, feature implementation,
  refactoring, performance optimization, security audits.
  Skip for: single file edits, simple fixes, documentation.
---

# Swarm Orchestration Skill

## When to Use
- Complex tasks requiring 3+ agents
- Multi-file changes
- Cross-module refactoring

## Available Agents
| Type | Use Case |
|------|----------|
| researcher | Requirements analysis |
| architect | System design |
| coder | Implementation |
| tester | Test writing |
| reviewer | Code review |

## Execution Pattern

### 1. Initialize Swarm
```bash
npx gemiflow@v3alpha swarm init --topology hierarchical
```

### 2. Spawn Agents
Use gemini to orchestrate via MCP:
```bash
npx gemiflow@v3alpha mcp start
```

### 3. Monitor Progress
```bash
npx gemiflow@v3alpha swarm status
```

## Memory Integration
Store patterns for learning:
```bash
npx gemiflow@v3alpha memory store --key "[pattern]" --value "[learned]"
```
```

### Generated config.toml

```toml
# GemiFlow V3 - gemini Configuration
# Generated by: gemiflow init --gemini

model = "gpt-5.3-gemini"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"

# Project documentation
project_doc_max_bytes = 65536
project_doc_fallback_filenames = ["AGENTS.md", "TEAM_GUIDE.md", ".agents.md"]

[features]
child_agents_md = true
shell_snapshot = true
request_rule = true

# MCP Servers
[mcp_servers.gemiflow]
command = "npx"
args = ["-y", "@gemiflow/cli@latest"]
enabled = true
tool_timeout_sec = 120

[mcp_servers.ruv-swarm]
command = "npx"
args = ["-y", "ruv-swarm", "mcp", "start"]
enabled = true

# Skills configuration
[[skills.config]]
path = ".agents/skills/swarm-orchestration"
enabled = true

[[skills.config]]
path = ".agents/skills/memory-management"
enabled = true

[[skills.config]]
path = ".agents/skills/sparc-methodology"
enabled = true

# Profiles
[profiles.dev]
approval_policy = "never"
sandbox_mode = "danger-full-access"

[profiles.safe]
approval_policy = "untrusted"
sandbox_mode = "read-only"
```

## Consequences

### Positive
1. **Cross-platform support** - Users can use either Gemini CLI or gemini
2. **Ecosystem reach** - AGENTS.md is supported by 20+ tools (Cursor, Copilot, etc.)
3. **Standard compliance** - Follows AAIF and Open Agent Skills specifications
4. **Migration path** - Easy conversion between platforms
5. **Dual-mode** - Single project can support both tools

### Negative
1. **Maintenance burden** - Two sets of generators to maintain
2. **Sync complexity** - Keeping CLAUDE.md and AGENTS.md in sync
3. **Feature parity** - Some features may not map 1:1

### Risks
1. **Specification drift** - AGENTS.md spec may evolve
2. **Tool differences** - Behavioral differences between platforms
3. **Ecosystem fragmentation** - Users may expect identical behavior

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)
1. Create `@gemiflow/gemini` package in `v3/@gemiflow/gemini/`
2. Implement AGENTS.md generator
3. Implement SKILL.md generator
4. Implement config.toml generator
5. Set up npm publishing for `@gemiflow/gemini`

### Phase 2: Init Integration (Week 3)
1. Add `--gemini` flag to init command
2. Add `--dual` flag for both platforms
3. Add `--from-claude` and `--from-gemini` conversion
4. Update wizard to support platform selection
5. Wire up `@gemiflow/gemini` as dependency

### Phase 3: Skills Library (Week 4)
1. Convert all `.gemiflow/skills/` to `.agents/skills/` format
2. Create skill migration script
3. Test skill discovery and loading
4. Publish skills as part of `@gemiflow/gemini`

### Phase 4: Automation Integration (Week 5)
1. Map gemiflow hooks to gemini Automations
2. Create automation templates
3. Document automation patterns

### Phase 5: Coflow Transition (Week 6+)
1. Create `coflow` npm package (umbrella)
2. Update CLI entry points for `npx coflow`
3. Maintain `gemiflow` as alias for compatibility
4. Update documentation for dual branding

## References

### Official Documentation
- [AGENTS.md Specification](https://agents.md/)
- [OpenAI gemini CLI](https://developers.openai.com/gemini/cli/)
- [gemini Skills](https://developers.openai.com/gemini/skills)
- [gemini Configuration Reference](https://developers.openai.com/gemini/config-reference/)
- [gemini Automations](https://developers.openai.com/gemini/app/automations/)
- [Agents SDK Integration](https://developers.openai.com/gemini/guides/agents-sdk/)

### GitHub Repositories
- [OpenAI gemini](https://github.com/openai/gemini)
- [gemini AGENTS.md Example](https://github.com/openai/gemini/blob/main/AGENTS.md)

### Related Standards
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [Agentic AI Foundation](https://aaif.org/)

## Appendix A: Complete Feature Mapping

### AGENTS.md Sections (GemiFlow Template)

| Section | Content Source |
|---------|----------------|
| Project Overview | Auto-detected from package.json, README |
| Quick Start | Build/test commands from package.json |
| Agent Coordination | From CLAUDE.md swarm config |
| Code Standards | From CLAUDE.md behavioral rules |
| Security | From @gemiflow/security patterns |
| Performance | From V3 performance targets |
| Testing | From TDD/testing patterns |
| Memory | From AgentDB integration |

### Skill Mapping (Full List)

| Gemini CLI Skill | gemini Skill Directory |
|-------------------|----------------------|
| `swarm-orchestration.md` | `.agents/skills/swarm-orchestration/` |
| `agentdb-advanced.md` | `.agents/skills/memory-management/` |
| `sparc-methodology.md` | `.agents/skills/sparc-methodology/` |
| `github-workflow-automation.md` | `.agents/skills/github-automation/` |
| `v3-core-implementation.md` | `.agents/skills/v3-core/` |
| `pair-programming.md` | `.agents/skills/pair-programming/` |
| `performance-analysis.md` | `.agents/skills/performance-analysis/` |
| `v3-security-overhaul.md` | `.agents/skills/security-audit/` |
| `hive-mind-advanced.md` | `.agents/skills/hive-mind/` |
| `reasoningbank-intelligence.md` | `.agents/skills/adaptive-learning/` |

### Config.toml Feature Mapping

| Gemini CLI Feature | gemini config.toml |
|--------------------|--------------------|
| Hooks: PreToolUse | `approval_policy` |
| Hooks: PostToolUse | Automations |
| Hooks: UserPromptSubmit | Skills + Automations |
| Permission modes | `approval_policy` + `sandbox_mode` |
| MCP servers | `[mcp_servers]` table |
| Model selection | `model` |
| Session persistence | `history.persistence` |

## Appendix B: gemini CLI Reference

### Core Commands

| Command | Description |
|---------|-------------|
| `gemini` | Interactive terminal UI |
| `gemini exec` | Non-interactive execution |
| `gemini resume` | Continue previous session |
| `gemini fork` | Branch from existing session |
| `gemini cloud` | Cloud task management |
| `gemini apply` | Apply diffs from cloud tasks |

### MCP Commands

| Command | Description |
|---------|-------------|
| `gemini mcp list` | List configured servers |
| `gemini mcp add <name>` | Add new server |
| `gemini mcp remove <name>` | Remove server |
| `gemini mcp-server` | Run gemini as MCP server |

### Feature Commands

| Command | Description |
|---------|-------------|
| `gemini features list` | Show feature flags |
| `gemini features enable <flag>` | Enable feature |
| `gemini features disable <flag>` | Disable feature |

### Approval Policies

| Policy | Behavior |
|--------|----------|
| `untrusted` | Prompt for every command |
| `on-failure` | Prompt only on failures |
| `on-request` | Prompt when agent requests |
| `never` | Never prompt (dangerous) |

### Sandbox Modes

| Mode | Behavior |
|------|----------|
| `read-only` | No file/network modifications |
| `workspace-write` | Write only to workspace |
| `danger-full-access` | Full system access |

## Appendix C: Undocumented Features for Integration

These features were discovered through binary analysis and can be leveraged for deep gemiflow integration.

### Environment Variables

| Variable | Purpose | Integration Use |
|----------|---------|-----------------|
| `gemini_HOME` | Override config directory | Project-specific configs |
| `gemini_CI=1` | CI mode | Pipeline optimization |
| `gemini_SANDBOX_NETWORK_DISABLED=1` | Disable network | Security hardening |
| `gemini_TUI_RECORD_SESSION=1` | Record session | Debug/learning |
| `gemini_TUI_SESSION_LOG_PATH` | Session log path | Pattern extraction |
| `gemini_STARTING_DIFF` | Initial diff | Session preloading |
| `gemini_GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub PAT | MCP GitHub integration |
| `gemini_CONNECTORS_TOKEN` | MCP connectors | Auth for MCP servers |

### JSON-RPC Methods (via MCP Server)

#### Thread Management
```javascript
// Start new thread
{ method: "thread/start", params: { prompt, cwd, approval_policy } }

// Fork thread for parallel work
{ method: "thread/fork", params: { threadId, prompt } }

// Resume thread
{ method: "thread/resume", params: { threadId } }

// Rollback thread
{ method: "thread/rollback", params: { threadId, numTurns } }

// List loaded threads
{ method: "thread/loaded/list", params: {} }
```

#### Skills Management
```javascript
// List available skills
{ method: "skills/list", params: {} }

// Read remote skill
{ method: "skills/remote/read", params: { path } }

// Write skill config
{ method: "skills/config/write", params: { path, enabled } }
```

#### Configuration
```javascript
// Batch write config
{ method: "config/batchWrite", params: { values: [...] } }

// Read requirements
{ method: "configRequirements/read", params: {} }

// Read rate limits
{ method: "account/rateLimits/read", params: {} }
```

### Hidden CLI Commands

| Command | Purpose | Usage |
|---------|---------|-------|
| `gemini debug-config` | Show config layers | Debug config issues |
| `gemini rollout` | Print rollout path | Access rollout files |

### Experimental Features (Enable via config.toml)

```toml
[features]
# Sub-agent spawning for multi-agent workflows
# Not officially documented but functional
experimentalApi = true

# Emit raw response items on event stream
experimentalRawEvents = true

# Enable collaboration modes
collab = true

# Enable app integrations
apps = true
```

### Ghost Snapshots

gemini uses "ghost commits" for state management:
- Creates temporary commits without modifying history
- Enables undo/rollback operations
- Uses `gemini snapshot@gemini.local` as author

**Integration opportunity**: Use similar pattern for swarm state management.

### Sub-Agent Collaboration

Internal structures support multi-agent collaboration:

```typescript
interface CollabAgentToolCall {
  senderThreadId: string;      // Originating agent
  receiverThreadIds: string[]; // Target agents
  prompt: string;              // Task description
  agentsStates: AgentState[];  // State tracking
}
```

**Integration opportunity**: Map to gemiflow swarm coordination.

### Dynamic Tool Registration

gemini supports runtime tool registration via MCP:

```javascript
// Register tool at runtime
{ method: "tools/register", params: { name, schema, handler } }
```

**Integration opportunity**: Register gemiflow tools dynamically.

### Integration Patterns Using Undocumented Features

#### 1. CI/CD Pipeline Mode
```bash
# Optimized for pipelines
gemini_CI=1 \
gemini_SANDBOX_NETWORK_DISABLED=1 \
gemini exec --json \
  -c "approval_policy='never'" \
  "run tests and generate report"
```

#### 2. Session Recording for Learning
```bash
# Record session for pattern extraction
gemini_TUI_RECORD_SESSION=1 \
gemini_TUI_SESSION_LOG_PATH=/tmp/gemini-session.log \
gemini
```

#### 3. Project-Specific Configuration
```bash
# Use project-local config
gemini_HOME=/project/.gemini gemini
```

#### 4. Programmatic Thread Control
```javascript
// Fork threads for parallel work
const threads = await Promise.all([
  geminiRpc({ method: "thread/fork", params: { threadId, prompt: "Task A" }}),
  geminiRpc({ method: "thread/fork", params: { threadId, prompt: "Task B" }}),
  geminiRpc({ method: "thread/fork", params: { threadId, prompt: "Task C" }})
]);
```

#### 5. Rate Limit Monitoring
```javascript
// Check rate limits before spawning agents
const limits = await geminiRpc({ method: "account/rateLimits/read" });
if (limits.remaining > 0) {
  await spawnAgents();
}
```

### Generated config.toml with Undocumented Features

```toml
# GemiFlow V3 - gemini Configuration (Enhanced)
# Includes undocumented features for advanced integration

model = "gpt-5.3-gemini"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"

# Enable experimental features for integration
[features]
child_agents_md = true
shell_snapshot = true
request_rule = true
# Undocumented but functional
collab = true
apps = true

# MCP Servers with auth
[mcp_servers.gemiflow]
command = "npx"
args = ["-y", "@gemiflow/cli@latest"]
enabled = true
tool_timeout_sec = 120
# Use gemini_CONNECTORS_TOKEN for auth

[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
enabled = true
# Reads gemini_GITHUB_PERSONAL_ACCESS_TOKEN

# CI Profile with undocumented options
[profiles.ci]
approval_policy = "never"
sandbox_mode = "workspace-write"
# Set gemini_CI=1 for additional optimizations
```
