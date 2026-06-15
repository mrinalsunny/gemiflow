# 🔍 Verification Commands

Truth verification system for ensuring code quality and correctness with a 0.95 accuracy threshold.

## Overview

The verification system provides real-time truth checking and validation for all agent tasks, ensuring high-quality outputs and automatic rollback on failures.

## Subcommands

### `verify check`
Run verification checks on current code or agent outputs.

```bash
gemiflow4gemini verify check --file src/app.js
gemiflow4gemini verify check --task "task-123"
gemiflow4gemini verify check --threshold 0.98
```

### `verify rollback`
Automatically rollback changes that fail verification.

```bash
gemiflow4gemini verify rollback --to-commit abc123
gemiflow4gemini verify rollback --last-good
gemiflow4gemini verify rollback --interactive
```

### `verify report`
Generate verification reports and metrics.

```bash
gemiflow4gemini verify report --format json
gemiflow4gemini verify report --export metrics.html
gemiflow4gemini verify report --period 7d
```

### `verify dashboard`
Launch interactive verification dashboard.

```bash
gemiflow4gemini verify dashboard
gemiflow4gemini verify dashboard --port 3000
gemiflow4gemini verify dashboard --export
```

## Configuration

Default threshold: **0.95** (95% accuracy required)

Configure in `.gemiflow4gemini/config.json`:
```json
{
  "verification": {
    "threshold": 0.95,
    "autoRollback": true,
    "gitIntegration": true,
    "hooks": {
      "preCommit": true,
      "preTask": true,
      "postEdit": true
    }
  }
}
```

## Integration

### With Swarm Commands
```bash
gemiflow4gemini swarm --verify --threshold 0.98
gemiflow4gemini hive-mind --verify
```

### With Training Pipeline
```bash
gemiflow4gemini train --verify --rollback-on-fail
```

### With Pair Programming
```bash
gemiflow4gemini pair --verify --real-time
```

## Metrics

- **Truth Score**: 0.0 to 1.0 (higher is better)
- **Confidence Level**: Statistical confidence in verification
- **Rollback Rate**: Percentage of changes rolled back
- **Quality Improvement**: Trend over time

## Examples

### Basic Verification
```bash
# Verify current directory
gemiflow4gemini verify check

# Verify with custom threshold
gemiflow4gemini verify check --threshold 0.99

# Verify and auto-fix
gemiflow4gemini verify check --auto-fix
```

### Advanced Workflows
```bash
# Continuous verification during development
gemiflow4gemini verify watch --directory src/

# Batch verification
gemiflow4gemini verify batch --files "*.js" --parallel

# Integration testing
gemiflow4gemini verify integration --test-suite full
```

## Performance

- Verification latency: <100ms for most checks
- Rollback time: <1s for git-based rollback
- Dashboard refresh: Real-time via WebSocket

## Related Commands

- `truth` - View truth scores and metrics
- `pair` - Collaborative development with verification
- `train` - Training with verification feedback