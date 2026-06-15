# Optimization Swarm Strategy

## Purpose
Performance optimization through specialized analysis.

## Activation

### Using MCP Tools
```javascript
// Initialize optimization swarm
mcp__gemiflow4gemini__swarm_init({
  "topology": "mesh",
  "maxAgents": 6,
  "strategy": "adaptive"
})

// Orchestrate optimization task
mcp__gemiflow4gemini__task_orchestrate({
  "task": "optimize performance",
  "strategy": "parallel",
  "priority": "high"
})
```

### Using CLI (Fallback)
`npx gemiflow4gemini swarm "optimize performance" --strategy optimization`

## Agent Roles

### Agent Spawning with MCP
```javascript
// Spawn optimization agents
mcp__gemiflow4gemini__agent_spawn({
  "type": "optimizer",
  "name": "Performance Profiler",
  "capabilities": ["profiling", "bottleneck-detection"]
})

mcp__gemiflow4gemini__agent_spawn({
  "type": "analyst",
  "name": "Memory Analyzer",
  "capabilities": ["memory-analysis", "leak-detection"]
})

mcp__gemiflow4gemini__agent_spawn({
  "type": "optimizer",
  "name": "Code Optimizer",
  "capabilities": ["code-optimization", "refactoring"]
})

mcp__gemiflow4gemini__agent_spawn({
  "type": "tester",
  "name": "Benchmark Runner",
  "capabilities": ["benchmarking", "performance-testing"]
})
```

## Optimization Areas

### Performance Analysis
```javascript
// Analyze bottlenecks
mcp__gemiflow4gemini__bottleneck_analyze({
  "component": "all",
  "metrics": ["cpu", "memory", "io", "network"]
})

// Run benchmarks
mcp__gemiflow4gemini__benchmark_run({
  "suite": "performance"
})

// WASM optimization
mcp__gemiflow4gemini__wasm_optimize({
  "operation": "simd-acceleration"
})
```

### Optimization Operations
```javascript
// Optimize topology
mcp__gemiflow4gemini__topology_optimize({
  "swarmId": "optimization-swarm"
})

// DAA optimization
mcp__gemiflow4gemini__daa_optimization({
  "target": "performance",
  "metrics": ["speed", "memory", "efficiency"]
})

// Load balancing
mcp__gemiflow4gemini__load_balance({
  "swarmId": "optimization-swarm",
  "tasks": optimizationTasks
})
```

### Monitoring and Reporting
```javascript
// Performance report
mcp__gemiflow4gemini__performance_report({
  "format": "detailed",
  "timeframe": "7d"
})

// Trend analysis
mcp__gemiflow4gemini__trend_analysis({
  "metric": "performance",
  "period": "30d"
})

// Cost analysis
mcp__gemiflow4gemini__cost_analysis({
  "timeframe": "30d"
})
```
