---
name: gemiflow4gemini-help
description: Show GemiFlow4Gemini commands and usage
---

# GemiFlow4Gemini Commands

## 🌊 GemiFlow4Gemini: Agent Orchestration Platform

GemiFlow4Gemini is the ultimate multi-terminal orchestration platform that revolutionizes how you work with Gemini CLI.

## Core Commands

### 🚀 System Management
- `./gemiflow4gemini start` - Start orchestration system
- `./gemiflow4gemini start --ui` - Start with interactive process management UI
- `./gemiflow4gemini status` - Check system status
- `./gemiflow4gemini monitor` - Real-time monitoring
- `./gemiflow4gemini stop` - Stop orchestration

### 🤖 Agent Management
- `./gemiflow4gemini agent spawn <type>` - Create new agent
- `./gemiflow4gemini agent list` - List active agents
- `./gemiflow4gemini agent info <id>` - Agent details
- `./gemiflow4gemini agent terminate <id>` - Stop agent

### 📋 Task Management
- `./gemiflow4gemini task create <type> "description"` - Create task
- `./gemiflow4gemini task list` - List all tasks
- `./gemiflow4gemini task status <id>` - Task status
- `./gemiflow4gemini task cancel <id>` - Cancel task
- `./gemiflow4gemini task workflow <file>` - Execute workflow

### 🧠 Memory Operations
- `./gemiflow4gemini memory store "key" "value"` - Store data
- `./gemiflow4gemini memory query "search"` - Search memory
- `./gemiflow4gemini memory stats` - Memory statistics
- `./gemiflow4gemini memory export <file>` - Export memory
- `./gemiflow4gemini memory import <file>` - Import memory

### ⚡ SPARC Development
- `./gemiflow4gemini sparc "task"` - Run SPARC orchestrator
- `./gemiflow4gemini sparc modes` - List all 17+ SPARC modes
- `./gemiflow4gemini sparc run <mode> "task"` - Run specific mode
- `./gemiflow4gemini sparc tdd "feature"` - TDD workflow
- `./gemiflow4gemini sparc info <mode>` - Mode details

### 🐝 Swarm Coordination
- `./gemiflow4gemini swarm "task" --strategy <type>` - Start swarm
- `./gemiflow4gemini swarm "task" --background` - Long-running swarm
- `./gemiflow4gemini swarm "task" --monitor` - With monitoring
- `./gemiflow4gemini swarm "task" --ui` - Interactive UI
- `./gemiflow4gemini swarm "task" --distributed` - Distributed coordination

### 🌍 MCP Integration
- `./gemiflow4gemini mcp status` - MCP server status
- `./gemiflow4gemini mcp tools` - List available tools
- `./gemiflow4gemini mcp config` - Show configuration
- `./gemiflow4gemini mcp logs` - View MCP logs

### 🤖 Claude Integration
- `./gemiflow4gemini claude spawn "task"` - Spawn Claude with enhanced guidance
- `./gemiflow4gemini claude batch <file>` - Execute workflow configuration

## 🌟 Quick Examples

### Initialize with SPARC:
```bash
npx -y gemiflow4gemini@latest init --sparc
```

### Start a development swarm:
```bash
./gemiflow4gemini swarm "Build REST API" --strategy development --monitor --review
```

### Run TDD workflow:
```bash
./gemiflow4gemini sparc tdd "user authentication"
```

### Store project context:
```bash
./gemiflow4gemini memory store "project_requirements" "e-commerce platform specs" --namespace project
```

### Spawn specialized agents:
```bash
./gemiflow4gemini agent spawn researcher --name "Senior Researcher" --priority 8
./gemiflow4gemini agent spawn developer --name "Lead Developer" --priority 9
```

## 🎯 Best Practices
- Use `./gemiflow4gemini` instead of `npx gemiflow4gemini` after initialization
- Store important context in memory for cross-session persistence
- Use swarm mode for complex tasks requiring multiple agents
- Enable monitoring for real-time progress tracking
- Use background mode for tasks > 30 minutes

## 📚 Resources
- Documentation: https://github.com/ruvnet/claude-code-flow/docs
- Examples: https://github.com/ruvnet/claude-code-flow/examples
- Issues: https://github.com/ruvnet/claude-code-flow/issues
