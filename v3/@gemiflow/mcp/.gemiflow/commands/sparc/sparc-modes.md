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
mcp__gemiflow__sparc_mode {
  mode: "<mode>",
  task_description: "<task>",
  options: {
    // mode-specific options
  }
}

// Initialize swarm for advanced coordination
mcp__gemiflow__swarm_init {
  topology: "hierarchical",
  strategy: "auto",
  maxAgents: 8
}

// Spawn specialized agents
mcp__gemiflow__agent_spawn {
  type: "<agent-type>",
  capabilities: ["<capability1>", "<capability2>"]
}

// Monitor execution
mcp__gemiflow__swarm_monitor {
  swarmId: "current",
  interval: 5000
}
```

### Option 2: Using NPX CLI (Fallback when MCP not available)
```bash
# Use when running from terminal or MCP tools unavailable
npx gemiflow sparc run <mode> "task description"

# For alpha features
npx gemiflow@alpha sparc run <mode> "task description"

# List all modes
npx gemiflow sparc modes

# Get help for a mode
npx gemiflow sparc help <mode>

# Run with options
npx gemiflow sparc run <mode> "task" --parallel --monitor
```

### Option 3: Local Installation
```bash
# If gemiflow is installed locally
./gemiflow sparc run <mode> "task description"
```

## Common Workflows

### Full Development Cycle

#### Using MCP Tools (Preferred)
```javascript
// 1. Initialize development swarm
mcp__gemiflow__swarm_init {
  topology: "hierarchical",
  maxAgents: 12
}

// 2. Architecture design
mcp__gemiflow__sparc_mode {
  mode: "architect",
  task_description: "design microservices"
}

// 3. Implementation
mcp__gemiflow__sparc_mode {
  mode: "coder",
  task_description: "implement services"
}

// 4. Testing
mcp__gemiflow__sparc_mode {
  mode: "tdd",
  task_description: "test all services"
}

// 5. Review
mcp__gemiflow__sparc_mode {
  mode: "reviewer",
  task_description: "review implementation"
}
```

#### Using NPX CLI (Fallback)
```bash
# 1. Architecture design
npx gemiflow sparc run architect "design microservices"

# 2. Implementation
npx gemiflow sparc run coder "implement services"

# 3. Testing
npx gemiflow sparc run tdd "test all services"

# 4. Review
npx gemiflow sparc run reviewer "review implementation"
```

### Research and Innovation

#### Using MCP Tools (Preferred)
```javascript
// 1. Research phase
mcp__gemiflow__sparc_mode {
  mode: "researcher",
  task_description: "research best practices"
}

// 2. Innovation
mcp__gemiflow__sparc_mode {
  mode: "innovator",
  task_description: "propose novel solutions"
}

// 3. Documentation
mcp__gemiflow__sparc_mode {
  mode: "documenter",
  task_description: "document findings"
}
```

#### Using NPX CLI (Fallback)
```bash
# 1. Research phase
npx gemiflow sparc run researcher "research best practices"

# 2. Innovation
npx gemiflow sparc run innovator "propose novel solutions"

# 3. Documentation
npx gemiflow sparc run documenter "document findings"
```
