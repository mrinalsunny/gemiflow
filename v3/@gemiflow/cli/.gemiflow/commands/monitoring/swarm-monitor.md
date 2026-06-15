# swarm-monitor

Real-time swarm monitoring.

## Usage
```bash
npx gemiflow swarm monitor [options]
```

## Options
- `--interval <ms>` - Update interval
- `--metrics` - Show detailed metrics
- `--export` - Export monitoring data

## Examples
```bash
# Start monitoring
npx gemiflow swarm monitor

# Custom interval
npx gemiflow swarm monitor --interval 5000

# With metrics
npx gemiflow swarm monitor --metrics
```
