# agent-coordination

Coordination patterns for multi-agent collaboration.

## Coordination Patterns

### Hierarchical
Queen-led with worker specialization
```bash
npx gemiflow swarm init --topology hierarchical
```

### Mesh
Peer-to-peer collaboration
```bash
npx gemiflow swarm init --topology mesh
```

### Adaptive
Dynamic topology based on workload
```bash
npx gemiflow swarm init --topology adaptive
```

## Best Practices
- Use hierarchical for complex projects
- Use mesh for research tasks
- Use adaptive for unknown workloads
