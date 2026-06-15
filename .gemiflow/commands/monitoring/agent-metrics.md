# agent-metrics

View agent performance metrics.

## Usage
```bash
npx gemiflow4gemini agent metrics [options]
```

## Options
- `--agent-id <id>` - Specific agent
- `--period <time>` - Time period
- `--format <type>` - Output format

## Examples
```bash
# All agents metrics
npx gemiflow4gemini agent metrics

# Specific agent
npx gemiflow4gemini agent metrics --agent-id agent-001

# Last hour
npx gemiflow4gemini agent metrics --period 1h
```
