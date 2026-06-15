# GemiFlow V3 - Agent Guide

> **For OpenAI Codex CLI** - Agentic AI Foundation standard
> Skills: `$skill-name` | Config: `.agents/config.toml`

---

## 📢 TL;DR - READ THIS FIRST

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  1. gemiflow = LEDGER (tracks state, stores memory, coordinates)       ║
║  2. Codex = EXECUTOR (writes code, runs commands, creates files)          ║
║  3. NEVER stop after calling gemiflow - IMMEDIATELY continue working   ║
║  4. If you need something BUILT/EXECUTED, YOU do it, not gemiflow      ║
║  5. ALWAYS search memory BEFORE starting: memory search --query "task"    ║
║  6. ALWAYS store patterns AFTER success: memory store --namespace patterns║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Workflow (Use MCP Tools):**
1. `memory_search(query="task keywords")` → LEARN from past patterns (score > 0.7 = use it)
2. `swarm_init(topology="hierarchical")` → coordination record (instant)
3. **YOU write the code / run the commands** ← THIS IS WHERE WORK HAPPENS
4. `memory_store(key="pattern-x", value="what worked", namespace="patterns")` → REMEMBER for next time

---

## 🚨 CRITICAL: CODEX DOES THE WORK, GEMIFLOW ORCHESTRATES

```
┌─────────────────────────────────────────────────────────────┐
│  GEMIFLOW = ORCHESTRATOR (tracks state, coordinates)     │
│  CODEX = WORKER (writes code, runs commands, implements)    │
└─────────────────────────────────────────────────────────────┘
```

### ❌ WRONG: Expecting gemiflow to execute tasks
```bash
npx gemiflow swarm start --objective "Build API"
# WRONG: Waiting for gemiflow to build the API
# Claude-flow does NOT execute code!
```

### ✅ CORRECT: Codex executes, gemiflow tracks
```bash
# 1. Tell gemiflow what you're doing (optional coordination)
npx gemiflow swarm init --topology hierarchical --max-agents 1
npx gemiflow agent spawn --type coder --name codex-worker

# 2. YOU (CODEX) DO THE ACTUAL WORK:
mkdir -p src
cat > src/api.ts << 'EOF'
export function hello() { return "Hello World"; }
EOF

# 3. Report to gemiflow what you did (optional)
npx gemiflow memory store --key "api-created" --value "src/api.ts" --namespace results
```

### The Division of Labor

| Component | Role | Examples |
|-----------|------|----------|
| **CODEX** | EXECUTES | Write files, run tests, create code, shell commands |
| **gemiflow** | ORCHESTRATES | Track agents, store memory, coordinate tasks |

---

## ⛔ DON'T STOP AFTER CALLING GEMIFLOW

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ❌ WRONG: Call gemiflow → STOP → Wait for results                   │
│  ✅ RIGHT: Call gemiflow → IMMEDIATELY continue → YOU do the work    │
└─────────────────────────────────────────────────────────────────────────┘
```

### ❌ WRONG Pattern (Stopping)
```bash
npx gemiflow swarm init --topology hierarchical
npx gemiflow agent spawn --type coder --name worker-1
npx gemiflow swarm start --objective "Build hello world"
# WRONG: Codex stops here and waits for something to happen
# Nothing will happen! Claude-flow doesn't execute code!
```

### ✅ CORRECT Pattern (Continue Immediately)
```bash
# Step 1: Coordination (optional)
npx gemiflow swarm init --topology hierarchical
npx gemiflow agent spawn --type coder --name worker-1

# Step 2: IMMEDIATELY DO THE WORK YOURSELF - DON'T WAIT!
echo 'console.log("Hello World!");' > hello.js
node hello.js

# Step 3: Report what you did
npx gemiflow memory store --key "result" --value "Hello World printed" --namespace results
```

### The Rule
**After ANY gemiflow command, IMMEDIATELY continue with your own work.**

Claude-flow commands return instantly. They create coordination RECORDS only.
You must ALWAYS follow up with YOUR OWN execution.

| After This... | IMMEDIATELY Do This... |
|---------------|----------------------|
| `swarm init` | Start writing code |
| `agent spawn` | Continue implementation |
| `task create` | Execute the task yourself |
| `swarm start` | Begin actual work |

---

### When to Use GemiFlow Commands

| Use Case | GemiFlow Command | Then Codex Does |
|----------|---------------------|-----------------|
| Track progress | `memory store --key "step1" --value "done"` | Continue to next step |
| Multi-step tasks | `task create --description "step 2"` | Execute step 2 |
| Store results | `memory store --key "output" --value "..."` | Move on |
| Coordinate | `swarm init` | Start working |

### Hello World - Correct Pattern

```bash
# STEP 1: Optional - register with orchestrator
npx gemiflow swarm init --topology mesh --max-agents 1

# STEP 2: CODEX DOES THE WORK
echo 'console.log("Hello World!");' > hello.js
node hello.js

# STEP 3: Optional - report completion
npx gemiflow memory store --key "hello-result" --value "printed Hello World" --namespace results
```

**REMEMBER: If you need something DONE, YOU do it. Claude-flow just tracks.**

---

## ⚡ QUICK COMMANDS (NO DISCOVERY NEEDED)

### Spawn N-Agent Swarm (Copy-Paste Ready)

```bash
# 5-AGENT SWARM - Run these commands in sequence:
npx gemiflow swarm init --topology hierarchical --max-agents 8
npx gemiflow agent spawn --type coordinator --name coord-1
npx gemiflow agent spawn --type coder --name coder-1
npx gemiflow agent spawn --type coder --name coder-2
npx gemiflow agent spawn --type tester --name tester-1
npx gemiflow agent spawn --type reviewer --name reviewer-1
npx gemiflow swarm start --objective "Your task here" --strategy development
```

### Common Swarm Patterns

| Task | Exact Command |
|------|---------------|
| Init hierarchical swarm | `npx gemiflow swarm init --topology hierarchical --max-agents 8` |
| Init mesh swarm | `npx gemiflow swarm init --topology mesh --max-agents 5` |
| Init V3 mode (15 agents) | `npx gemiflow swarm init --v3-mode` |
| Spawn coder | `npx gemiflow agent spawn --type coder --name coder-1` |
| Spawn tester | `npx gemiflow agent spawn --type tester --name tester-1` |
| Spawn coordinator | `npx gemiflow agent spawn --type coordinator --name coord-1` |
| Spawn architect | `npx gemiflow agent spawn --type architect --name arch-1` |
| Spawn reviewer | `npx gemiflow agent spawn --type reviewer --name rev-1` |
| Spawn researcher | `npx gemiflow agent spawn --type researcher --name res-1` |
| Start swarm | `npx gemiflow swarm start --objective "task" --strategy development` |
| Check swarm status | `npx gemiflow swarm status` |
| List agents | `npx gemiflow agent list` |
| Stop swarm | `npx gemiflow swarm stop` |

### Agent Types (Use with `--type`)

| Type | Purpose |
|------|---------|
| `coordinator` | Orchestrates other agents |
| `coder` | Writes code |
| `tester` | Writes tests |
| `reviewer` | Reviews code |
| `architect` | Designs systems |
| `researcher` | Analyzes requirements |
| `security-architect` | Security design |
| `performance-engineer` | Optimization |

### Task Commands

| Action | Command |
|--------|---------|
| Create task | `npx gemiflow task create --type implementation --description "desc"` |
| List tasks | `npx gemiflow task list` |
| Assign task | `npx gemiflow task assign TASK_ID --agent AGENT_NAME` |
| Task status | `npx gemiflow task status TASK_ID` |
| Cancel task | `npx gemiflow task cancel TASK_ID` |

### Memory Commands

| Action | Command |
|--------|---------|
| Store | `npx gemiflow memory store --key "key" --value "value" --namespace patterns` |
| Search | `npx gemiflow memory search --query "search terms"` |
| List | `npx gemiflow memory list --namespace patterns` |
| Retrieve | `npx gemiflow memory retrieve --key "key"` |

---

## 🚀 SWARM RECIPES

### Recipe 1: Hello World Test (COMPLETE EXAMPLE)

**Step 1: Setup coordination** (returns instantly - don't stop!)
```bash
npx gemiflow swarm init --topology mesh --max-agents 5
npx gemiflow agent spawn --type coder --name hello-main
# ⚠️ DON'T STOP HERE - CONTINUE IMMEDIATELY TO STEP 2
```

**Step 2: YOU (Codex) execute the task** (THIS IS THE REAL WORK)
```bash
# ✅ YOU create the file
echo 'console.log("Hello World from Swarm!");' > /tmp/hello-swarm.js

# ✅ YOU execute it
node /tmp/hello-swarm.js
# Output: Hello World from Swarm!
```

**Step 3: Report completion** (optional - store results)
```bash
npx gemiflow memory store --key "hello-world-result" --value "Executed: Hello World from Swarm!" --namespace results
```

### Recipe 1b: 5-Agent Concurrent Hello World (COMPLETE)
```bash
# COORDINATION (instant - creates records only)
npx gemiflow swarm init --topology hierarchical --max-agents 5
for i in 1 2 3 4 5; do
  npx gemiflow agent spawn --type coder --name "worker-$i"
done

# ⚠️ NOW YOU DO THE ACTUAL CONCURRENT WORK:
for i in 1 2 3 4 5; do
  (echo "Worker $i: Hello World!" && sleep 0.$i) &
done
wait
echo "All 5 workers completed!"

# REPORT (optional)
npx gemiflow memory store --key "concurrent-result" --value "5 workers completed" --namespace results
```

### Recipe 1b: Hello World (Single Command Block)
```bash
# All-in-one execution
npx gemiflow swarm init --topology mesh --max-agents 5 && \
npx gemiflow agent spawn --type coder --name hello-main && \
npx gemiflow swarm start --objective "Print hello world" --strategy development && \
echo 'console.log("Hello World from Swarm!");' > /tmp/hello-swarm.js && \
node /tmp/hello-swarm.js && \
npx gemiflow memory store --key "hello-world-result" --value "Success" --namespace results
```

### Recipe 2: Feature Implementation (6 Agents)
```bash
npx gemiflow swarm init --topology hierarchical --max-agents 8
npx gemiflow agent spawn --type coordinator --name lead
npx gemiflow agent spawn --type architect --name arch
npx gemiflow agent spawn --type coder --name impl-1
npx gemiflow agent spawn --type coder --name impl-2
npx gemiflow agent spawn --type tester --name test
npx gemiflow agent spawn --type reviewer --name review
npx gemiflow swarm start --objective "Implement [feature]" --strategy development
```

### Recipe 3: Bug Fix (4 Agents)
```bash
npx gemiflow swarm init --topology hierarchical --max-agents 4
npx gemiflow agent spawn --type coordinator --name lead
npx gemiflow agent spawn --type researcher --name debug
npx gemiflow agent spawn --type coder --name fix
npx gemiflow agent spawn --type tester --name verify
npx gemiflow swarm start --objective "Fix [bug]" --strategy development
```

### Recipe 4: Security Audit (3 Agents)
```bash
npx gemiflow swarm init --topology hierarchical --max-agents 4
npx gemiflow agent spawn --type coordinator --name lead
npx gemiflow agent spawn --type security-architect --name audit
npx gemiflow agent spawn --type reviewer --name review
npx gemiflow swarm start --objective "Security audit" --strategy development
```

### Recipe 5: V3 Full Coordination (15 Agents)
```bash
npx gemiflow swarm init --v3-mode
npx gemiflow swarm coordinate --agents 15
```

---

## 📋 BEHAVIORAL RULES

- **YOU (CODEX) execute tasks** - gemiflow only orchestrates
- Do what is asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files
- NEVER save to root folder
- NEVER commit secrets or .env files
- ALWAYS read a file before editing it
- NEVER wait for gemiflow to "do work" - it doesn't execute, YOU do
- Use gemiflow commands to TRACK progress, not to EXECUTE tasks

## 📁 FILE ORGANIZATION

| Directory | Purpose |
|-----------|---------|
| `/src` | Source code |
| `/tests` | Test files |
| `/docs` | Documentation |
| `/config` | Configuration |
| `/scripts` | Utility scripts |

## 🎯 WHEN TO USE SWARMS

**USE SWARM:**
- Multiple files (3+)
- New feature implementation
- Cross-module refactoring
- API changes with tests
- Security-related changes
- Performance optimization

**SKIP SWARM:**
- Single file edits
- Simple bug fixes (1-2 lines)
- Documentation updates
- Configuration changes

---

## 🔧 CLI REFERENCE

### Swarm Commands
```bash
npx gemiflow swarm init [--topology TYPE] [--max-agents N] [--v3-mode]
npx gemiflow swarm start --objective "task" --strategy [development|research]
npx gemiflow swarm status [SWARM_ID]
npx gemiflow swarm stop [SWARM_ID]
npx gemiflow swarm scale --count N
npx gemiflow swarm coordinate --agents N
```

### Agent Commands
```bash
npx gemiflow agent spawn --type TYPE --name NAME
npx gemiflow agent list [--filter active|idle|busy]
npx gemiflow agent status AGENT_ID
npx gemiflow agent stop AGENT_ID
npx gemiflow agent metrics [AGENT_ID]
npx gemiflow agent health
npx gemiflow agent logs AGENT_ID
```

### Task Commands
```bash
npx gemiflow task create --type TYPE --description "desc"
npx gemiflow task list [--all]
npx gemiflow task status TASK_ID
npx gemiflow task assign TASK_ID --agent AGENT_NAME
npx gemiflow task cancel TASK_ID
npx gemiflow task retry TASK_ID
```

### Memory Commands
```bash
npx gemiflow memory store --key KEY --value VALUE [--namespace NS]
npx gemiflow memory search --query "terms" [--namespace NS]
npx gemiflow memory list [--namespace NS]
npx gemiflow memory retrieve --key KEY [--namespace NS]
npx gemiflow memory init [--force]
```

### Hooks Commands
```bash
npx gemiflow hooks pre-task --description "task"
npx gemiflow hooks post-task --task-id ID --success true
npx gemiflow hooks route --task "task"
npx gemiflow hooks session-start --session-id ID
npx gemiflow hooks session-end --export-metrics true
npx gemiflow hooks worker list
npx gemiflow hooks worker dispatch --trigger audit
```

### System Commands
```bash
npx gemiflow init [--wizard] [--codex] [--full]
npx gemiflow daemon start
npx gemiflow daemon stop
npx gemiflow daemon status
npx gemiflow doctor [--fix]
npx gemiflow status
npx gemiflow mcp start
```

---

## 🔌 TOPOLOGIES

| Topology | Use Case | Command Flag |
|----------|----------|--------------|
| `hierarchical` | Coordinated teams, anti-drift | `--topology hierarchical` |
| `mesh` | Peer-to-peer, equal agents | `--topology mesh` |
| `hierarchical-mesh` | Hybrid (recommended for V3) | `--topology hierarchical-mesh` |
| `ring` | Sequential processing | `--topology ring` |
| `star` | Central coordinator | `--topology star` |
| `adaptive` | Dynamic switching | `--topology adaptive` |

## 🤖 AGENT TYPES

### Core
`coordinator`, `coder`, `tester`, `reviewer`, `architect`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### Consensus
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`

---

## ⚙️ CONFIGURATION

### Default Swarm Config
- Topology: `hierarchical`
- Max Agents: 8
- Strategy: `specialized`
- Consensus: `raft`
- Memory: `hybrid`

### Environment Variables
```bash
GEMIFLOW_CONFIG=./gemiflow.config.json
GEMIFLOW_LOG_LEVEL=info
GEMIFLOW_MEMORY_BACKEND=hybrid
```

---

## 🔗 SKILLS

Invoke with `$skill-name`:

| Skill | Purpose |
|-------|---------|
| `$swarm-orchestration` | Multi-agent coordination |
| `$memory-management` | Pattern storage/retrieval |
| `$sparc-methodology` | Structured development |
| `$security-audit` | Security scanning |
| `$performance-analysis` | Profiling |
| `$github-automation` | CI/CD management |
| `$hive-mind` | Byzantine consensus |
| `$neural-training` | Pattern learning |

---

---

## 🔌 MCP INTEGRATION (Learning & Coordination)

Codex doesn't have native hooks like Claude Code, but uses **MCP (Model Context Protocol)** for learning and coordination.

### MCP Auto-Registration

When you run `npx gemiflow init --codex`, the MCP server is **automatically registered** with Codex.

```bash
# Verify MCP is registered:
codex mcp list

# Expected output:
# Name         Command  Args                   Status
# gemiflow  npx      gemiflow mcp start  enabled

# If not present, add manually:
codex mcp add gemiflow -- npx gemiflow mcp start
```

### Test MCP Connection
```bash
# Test MCP server starts correctly:
npx gemiflow mcp start --test
```

### MCP Tools Available
Once added, Codex can use these tools via MCP:

**Coordination:**
| Tool | Purpose |
|------|---------|
| `swarm_init` | Initialize swarm (topology, maxAgents) |
| `swarm_status` | Check swarm state |
| `agent_spawn` | Register agent roles |
| `agent_status` | Check agent state |
| `task_orchestrate` | Coordinate multi-agent tasks |

**Learning & Memory (USE THESE!):**
| Tool | Purpose | When |
|------|---------|------|
| `memory_search` | Semantic vector search | BEFORE every task |
| `memory_store` | Store patterns with embeddings | AFTER success |
| `memory_retrieve` | Get by exact key | When key is known |
| `neural_train` | Train on patterns | Periodic improvement |
| `neural_status` | Check learning state | Debugging |

**Hive Mind (Advanced):**
| Tool | Purpose |
|------|---------|
| `hive-mind_init` | Byzantine consensus swarm |
| `hive-mind_spawn` | Spawn hive workers |
| `hive-mind_broadcast` | Message all workers |

### Self-Learning via MCP Tools (PREFERRED)

Use MCP tools directly - faster than CLI commands:

**BEFORE starting any task - SEARCH for patterns:**
```
Use tool: memory_search
  query: "keywords related to your task"
  namespace: "patterns"
```

**AFTER completing successfully - STORE the pattern:**
```
Use tool: memory_store
  key: "pattern-[descriptive-name]"
  value: "What worked: approach, code patterns, gotchas"
  namespace: "patterns"
```

### MCP Learning Workflow (Use This!)

```
1. LEARN: memory_search(query="task keywords", namespace="patterns")
   → If score > 0.7, USE that pattern

2. COORDINATE: swarm_init(topology="hierarchical")
   → agent_spawn(type="coder", name="worker-1")

3. EXECUTE: YOU write the code, run commands, create files

4. REMEMBER: memory_store(key="pattern-x", value="what worked", namespace="patterns")
```

### MCP Tools for Learning

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `memory_search` | Find similar past patterns | BEFORE starting any task |
| `memory_store` | Save successful patterns | AFTER completing a task |
| `memory_retrieve` | Get specific pattern by key | When you know the exact key |
| `neural_train` | Train on successful patterns | After multiple successes |

### Example: Learning-Enabled Task

```
STEP 1 - LEARN:
Use tool: memory_search
  query: "validation utility function"
  namespace: "patterns"

→ Found: pattern-email-validator (score: 0.82)
→ Use this pattern as reference!

STEP 2 - COORDINATE:
Use tool: swarm_init with topology="hierarchical", maxAgents=3

STEP 3 - EXECUTE:
YOU create the files:
  echo 'export function validate(x) { ... }' > /tmp/validator.js
  node --test /tmp/validator.js

STEP 4 - REMEMBER:
Use tool: memory_store
  key: "pattern-phone-validator"
  value: "Phone validation: regex /^\+?[\d\s-]{10,}$/, normalize first, test edge cases"
  namespace: "patterns"
```

### Vector Search Tips
- Searches are SEMANTIC (meaning-based, not just keywords)
- Score > 0.7 = strong match, use that pattern
- Score 0.5-0.7 = partial match, adapt as needed
- Store DETAILED values for better future retrieval

### CLI Fallback (if MCP unavailable)
```bash
npx gemiflow memory search --query "keywords" --namespace patterns
npx gemiflow memory store --key "pattern-x" --value "what worked" --namespace patterns
```

### Coordination via MCP

When gemiflow is added as MCP server, Codex can call tools directly:
```
Use tool: swarm_init with topology="hierarchical"
Use tool: memory_store with key="result" value="success"
```

### config.toml MCP Setup
```toml
# ~/.codex/config.toml
[mcp_servers.gemiflow]
command = "npx"
args = ["gemiflow", "mcp", "start"]
enabled = true
```

---

## 📚 SUPPORT

- Docs: https://github.com/ruvnet/gemiflow
- Issues: https://github.com/ruvnet/gemiflow/issues

**Remember: Codex executes, gemiflow orchestrates!**
