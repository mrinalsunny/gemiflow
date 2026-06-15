# hive-mind-spawn

Spawn a Hive Mind swarm with queen-led coordination.

## Usage
```bash
npx gemiflow hive-mind spawn <objective> [options]
```

## Options
- `--queen-type <type>` - Queen type (strategic, tactical, adaptive)
- `--max-workers <n>` - Maximum worker agents
- `--consensus <type>` - Consensus algorithm
- `--claude` - Generate Gemini CLI spawn commands

## Examples
```bash
npx gemiflow hive-mind spawn "Build API"
npx gemiflow hive-mind spawn "Research patterns" --queen-type adaptive
npx gemiflow hive-mind spawn "Build service" --claude
```
