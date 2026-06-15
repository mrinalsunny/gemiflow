# agent-metrics

View agent performance metrics.

## Usage
```bash
npx gemiflow agent metrics [options]
```

## Options
- `--agent-id <id>` - Specific agent
- `--period <time>` - Time period
- `--format <type>` - Output format

## Examples
```bash
# All agents metrics
npx gemiflow agent metrics

# Specific agent
npx gemiflow agent metrics --agent-id agent-001

# Last hour
npx gemiflow agent metrics --period 1h
```
