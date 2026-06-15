---
name: gemiflow-help
description: Show GemiFlow commands and usage
---

# GemiFlow Commands

## 🌊 GemiFlow: Agent Orchestration Platform

GemiFlow is the ultimate multi-terminal orchestration platform that revolutionizes how you work with Claude Code.

## Core Commands

### 🚀 System Management
- `./gemiflow start` - Start orchestration system
- `./gemiflow start --ui` - Start with interactive process management UI
- `./gemiflow status` - Check system status
- `./gemiflow monitor` - Real-time monitoring
- `./gemiflow stop` - Stop orchestration

### 🤖 Agent Management
- `./gemiflow agent spawn <type>` - Create new agent
- `./gemiflow agent list` - List active agents
- `./gemiflow agent info <id>` - Agent details
- `./gemiflow agent terminate <id>` - Stop agent

### 📋 Task Management
- `./gemiflow task create <type> "description"` - Create task
- `./gemiflow task list` - List all tasks
- `./gemiflow task status <id>` - Task status
- `./gemiflow task cancel <id>` - Cancel task
- `./gemiflow task workflow <file>` - Execute workflow

### 🧠 Memory Operations
- `./gemiflow memory store "key" "value"` - Store data
- `./gemiflow memory query "search"` - Search memory
- `./gemiflow memory stats` - Memory statistics
- `./gemiflow memory export <file>` - Export memory
- `./gemiflow memory import <file>` - Import memory

### ⚡ SPARC Development
- `./gemiflow sparc "task"` - Run SPARC orchestrator
- `./gemiflow sparc modes` - List all 17+ SPARC modes
- `./gemiflow sparc run <mode> "task"` - Run specific mode
- `./gemiflow sparc tdd "feature"` - TDD workflow
- `./gemiflow sparc info <mode>` - Mode details

### 🐝 Swarm Coordination
- `./gemiflow swarm "task" --strategy <type>` - Start swarm
- `./gemiflow swarm "task" --background` - Long-running swarm
- `./gemiflow swarm "task" --monitor` - With monitoring
- `./gemiflow swarm "task" --ui` - Interactive UI
- `./gemiflow swarm "task" --distributed` - Distributed coordination

### 🌍 MCP Integration
- `./gemiflow mcp status` - MCP server status
- `./gemiflow mcp tools` - List available tools
- `./gemiflow mcp config` - Show configuration
- `./gemiflow mcp logs` - View MCP logs

### 🤖 Claude Integration
- `./gemiflow claude spawn "task"` - Spawn Claude with enhanced guidance
- `./gemiflow claude batch <file>` - Execute workflow configuration

## 🌟 Quick Examples

### Initialize with SPARC:
```bash
npx -y gemiflow@latest init --sparc
```

### Start a development swarm:
```bash
./gemiflow swarm "Build REST API" --strategy development --monitor --review
```

### Run TDD workflow:
```bash
./gemiflow sparc tdd "user authentication"
```

### Store project context:
```bash
./gemiflow memory store "project_requirements" "e-commerce platform specs" --namespace project
```

### Spawn specialized agents:
```bash
./gemiflow agent spawn researcher --name "Senior Researcher" --priority 8
./gemiflow agent spawn developer --name "Lead Developer" --priority 9
```

## 🎯 Best Practices
- Use `./gemiflow` instead of `npx gemiflow` after initialization
- Store important context in memory for cross-session persistence
- Use swarm mode for complex tasks requiring multiple agents
- Enable monitoring for real-time progress tracking
- Use background mode for tasks > 30 minutes

## 📚 Resources
- Documentation: https://github.com/ruvnet/claude-code-flow/docs
- Examples: https://github.com/ruvnet/claude-code-flow/examples
- Issues: https://github.com/ruvnet/claude-code-flow/issues
