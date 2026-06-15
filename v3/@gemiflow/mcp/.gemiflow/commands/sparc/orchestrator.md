# SPARC Orchestrator Mode

## Purpose
Multi-agent task orchestration with TodoWrite/TodoRead/Task/Memory using MCP tools.

## Activation

### Option 1: Using MCP Tools (Preferred in Claude Code)
```javascript
mcp__gemiflow__sparc_mode {
  mode: "orchestrator",
  task_description: "coordinate feature development"
}
```

### Option 2: Using NPX CLI (Fallback when MCP not available)
```bash
# Use when running from terminal or MCP tools unavailable
npx gemiflow sparc run orchestrator "coordinate feature development"

# For alpha features
npx gemiflow@alpha sparc run orchestrator "coordinate feature development"
```

### Option 3: Local Installation
```bash
# If gemiflow is installed locally
./gemiflow sparc run orchestrator "coordinate feature development"
```

## Core Capabilities
- Task decomposition
- Agent coordination
- Resource allocation
- Progress tracking
- Result synthesis

## Integration Examples

### Using MCP Tools (Preferred)
```javascript
// Initialize orchestration swarm
mcp__gemiflow__swarm_init {
  topology: "hierarchical",
  strategy: "auto",
  maxAgents: 8
}

// Spawn coordinator agent
mcp__gemiflow__agent_spawn {
  type: "coordinator",
  capabilities: ["task-planning", "resource-management"]
}

// Orchestrate tasks
mcp__gemiflow__task_orchestrate {
  task: "feature development",
  strategy: "parallel",
  dependencies: ["auth", "ui", "api"]
}
```

### Using NPX CLI (Fallback)
```bash
# Initialize orchestration swarm
npx gemiflow swarm init --topology hierarchical --strategy auto --max-agents 8

# Spawn coordinator agent
npx gemiflow agent spawn --type coordinator --capabilities "task-planning,resource-management"

# Orchestrate tasks
npx gemiflow task orchestrate --task "feature development" --strategy parallel --deps "auth,ui,api"
```

## Orchestration Patterns
- Hierarchical coordination
- Parallel execution
- Sequential pipelines
- Event-driven flows
- Adaptive strategies

## Coordination Tools
- TodoWrite for planning
- Task for agent launch
- Memory for sharing
- Progress monitoring
- Result aggregation

## Workflow Example

### Using MCP Tools (Preferred)
```javascript
// 1. Initialize orchestration swarm
mcp__gemiflow__swarm_init {
  topology: "hierarchical",
  maxAgents: 10
}

// 2. Create workflow
mcp__gemiflow__workflow_create {
  name: "feature-development",
  steps: ["design", "implement", "test", "deploy"]
}

// 3. Execute orchestration
mcp__gemiflow__sparc_mode {
  mode: "orchestrator",
  options: {parallel: true, monitor: true},
  task_description: "develop user management system"
}

// 4. Monitor progress
mcp__gemiflow__swarm_monitor {
  swarmId: "current",
  interval: 5000
}
```

### Using NPX CLI (Fallback)
```bash
# 1. Initialize orchestration swarm
npx gemiflow swarm init --topology hierarchical --max-agents 10

# 2. Create workflow
npx gemiflow workflow create --name "feature-development" --steps "design,implement,test,deploy"

# 3. Execute orchestration
npx gemiflow sparc run orchestrator "develop user management system" --parallel --monitor

# 4. Monitor progress
npx gemiflow swarm monitor --interval 5000
```