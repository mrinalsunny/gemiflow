# SPARC Modes Overview

SPARC (Specification, Planning, Architecture, Review, Code) is a comprehensive development methodology with 17 specialized modes, all integrated with MCP tools for enhanced coordination and execution.

## Available Modes

### Core Orchestration Modes
- **orchestrator**: Multi-agent task orchestration
- **swarm-coordinator**: Specialized swarm management
- **workflow-manager**: Process automation
- **batch-executor**: Parallel task execution

### Development Modes  
- **coder**: Autonomous code generation
- **architect**: System design
- **reviewer**: Code review
- **tdd**: Test-driven development

### Analysis and Research Modes
- **researcher**: Deep research capabilities
- **analyzer**: Code and data analysis
- **optimizer**: Performance optimization

### Creative and Support Modes
- **designer**: UI/UX design
- **innovator**: Creative problem solving
- **documenter**: Documentation generation
- **debugger**: Systematic debugging
- **tester**: Comprehensive testing
- **memory-manager**: Knowledge management

## Usage

### Option 1: Using MCP Tools (Preferred in Claude Code)
```javascript
// Execute SPARC mode directly
mcp__gemiflow4gemini__sparc_mode {
  mode: "<mode>",
  task_description: "<task>",
  options: {
    // mode-specific options
  }
}

// Initialize swarm for advanced coordination
mcp__gemiflow4gemini__swarm_init {
  topology: "hierarchical",
  strategy: "auto",
  maxAgents: 8
}

// Spawn specialized agents
mcp__gemiflow4gemini__agent_spawn {
  type: "<agent-type>",
  capabilities: ["<capability1>", "<capability2>"]
}

// Monitor execution
mcp__gemiflow4gemini__swarm_monitor {
  swarmId: "current",
  interval: 5000
}
```

### Option 2: Using NPX CLI (Fallback when MCP not available)
```bash
# Use when running from terminal or MCP tools unavailable
npx gemiflow4gemini sparc run <mode> "task description"

# For alpha features
npx gemiflow4gemini@alpha sparc run <mode> "task description"

# List all modes
npx gemiflow4gemini sparc modes

# Get help for a mode
npx gemiflow4gemini sparc help <mode>

# Run with options
npx gemiflow4gemini sparc run <mode> "task" --parallel --monitor
```

### Option 3: Local Installation
```bash
# If gemiflow4gemini is installed locally
./gemiflow4gemini sparc run <mode> "task description"
```

## Common Workflows

### Full Development Cycle

#### Using MCP Tools (Preferred)
```javascript
// 1. Initialize development swarm
mcp__gemiflow4gemini__swarm_init {
  topology: "hierarchical",
  maxAgents: 12
}

// 2. Architecture design
mcp__gemiflow4gemini__sparc_mode {
  mode: "architect",
  task_description: "design microservices"
}

// 3. Implementation
mcp__gemiflow4gemini__sparc_mode {
  mode: "coder",
  task_description: "implement services"
}

// 4. Testing
mcp__gemiflow4gemini__sparc_mode {
  mode: "tdd",
  task_description: "test all services"
}

// 5. Review
mcp__gemiflow4gemini__sparc_mode {
  mode: "reviewer",
  task_description: "review implementation"
}
```

#### Using NPX CLI (Fallback)
```bash
# 1. Architecture design
npx gemiflow4gemini sparc run architect "design microservices"

# 2. Implementation
npx gemiflow4gemini sparc run coder "implement services"

# 3. Testing
npx gemiflow4gemini sparc run tdd "test all services"

# 4. Review
npx gemiflow4gemini sparc run reviewer "review implementation"
```

### Research and Innovation

#### Using MCP Tools (Preferred)
```javascript
// 1. Research phase
mcp__gemiflow4gemini__sparc_mode {
  mode: "researcher",
  task_description: "research best practices"
}

// 2. Innovation
mcp__gemiflow4gemini__sparc_mode {
  mode: "innovator",
  task_description: "propose novel solutions"
}

// 3. Documentation
mcp__gemiflow4gemini__sparc_mode {
  mode: "documenter",
  task_description: "document findings"
}
```

#### Using NPX CLI (Fallback)
```bash
# 1. Research phase
npx gemiflow4gemini sparc run researcher "research best practices"

# 2. Innovation
npx gemiflow4gemini sparc run innovator "propose novel solutions"

# 3. Documentation
npx gemiflow4gemini sparc run documenter "document findings"
```
