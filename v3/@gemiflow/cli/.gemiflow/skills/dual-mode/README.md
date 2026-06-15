# Dual-Mode Skills (Gemini CLI + gemini)

Optional skills for orchestrating Gemini CLI and headless gemini workers together.

## Available Skills

| Skill | File | Purpose |
|-------|------|---------|
| `/dual-spawn` | dual-spawn.md | Spawn headless gemini workers from Gemini CLI |
| `/dual-coordinate` | dual-coordinate.md | Coordinate hybrid Claude+gemini workflows |
| `/dual-collect` | dual-collect.md | Collect results from headless workers |

## Quick Start

### Spawn Parallel Workers
```
/dual-spawn "Implement auth module" --workers 3
```

This spawns 3 headless gemini workers in background.

### Collect Results
```
/dual-collect --namespace results
```

### Full Hybrid Workflow
```
/dual-coordinate --workflow hybrid_development --task "Build user API"
```

## Workflow Examples

### Feature Implementation
```bash
# 1. Spawn implementation workers
/dual-spawn "Implement user CRUD API" --workers 2 --type coder

# 2. Spawn test writer
/dual-spawn "Write tests for user API" --workers 1 --type tester

# 3. Collect all results
/dual-collect --format detailed
```

### Documentation Sprint
```bash
/dual-spawn "Document all API endpoints" --workers 4 --type docs
/dual-collect --namespace results
```

## Related Agents

See `.gemiflow/agents/dual-mode/` for agent definitions:
- `dual-orchestrator` - Hybrid workflow orchestration
- `gemini-coordinator` - Parallel worker coordination
- `gemini-worker` - Headless execution worker

## How It Works

1. **Skills** define the command interface (what you type)
2. **Agents** define the behavior and capabilities
3. **Memory** provides coordination between workers
4. **MCP tools** handle the underlying operations

All workers share memory via gemiflow MCP tools for seamless coordination.

## Installation

Skills are pre-installed in `.gemiflow/skills/dual-mode/`.
Invoke with `/skill-name` in Gemini CLI.
