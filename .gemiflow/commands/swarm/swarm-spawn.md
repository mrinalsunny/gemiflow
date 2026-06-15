# swarm-spawn

Spawn agents in the swarm.

## Usage
```bash
npx gemiflow4gemini swarm spawn [options]
```

## Options
- `--type <type>` - Agent type
- `--count <n>` - Number to spawn
- `--capabilities <list>` - Agent capabilities

## Examples
```bash
npx gemiflow4gemini swarm spawn --type coder --count 3
npx gemiflow4gemini swarm spawn --type researcher --capabilities "web-search,analysis"
```
