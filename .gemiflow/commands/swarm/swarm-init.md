# swarm-init

Initialize a new swarm with specified topology.

## Usage
```bash
npx gemiflow4gemini swarm init [options]
```

## Options
- `--topology <type>` - Swarm topology (mesh, hierarchical, ring, star)
- `--max-agents <n>` - Maximum agents
- `--strategy <type>` - Distribution strategy

## Examples
```bash
npx gemiflow4gemini swarm init --topology mesh
npx gemiflow4gemini swarm init --topology hierarchical --max-agents 8
```
