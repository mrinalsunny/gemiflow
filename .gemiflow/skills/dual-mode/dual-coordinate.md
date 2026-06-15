---
name: dual-coordinate
description: Coordinate hybrid Gemini CLI + gemini workflows
---

# Dual Coordinate Skill

Coordinate hybrid workflows that use Gemini CLI for interactive reasoning and gemini for parallel background execution.

## Usage

```
/dual-coordinate --workflow <workflow-name> --task "<task-description>"
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--workflow` | hybrid_development | Workflow template to use |
| `--task` | required | Task description |
| `--interactive-first` | true | Start with interactive phase |

## Available Workflows

### hybrid_development
Design interactively, implement in parallel, review interactively.

```
/dual-coordinate --workflow hybrid_development --task "Build user authentication"
```

### parallel_feature
Spawn multiple gemini workers for parallel implementation.

```
/dual-coordinate --workflow parallel_feature --task "Implement REST API"
```

### design_and_execute
Interactive design phase, then batch execution.

```
/dual-coordinate --workflow design_and_execute --task "Refactor auth module"
```

## How It Works

1. **Routing Decision**: Analyzes task to determine optimal platform split
2. **Interactive Phase**: Complex reasoning in Gemini CLI
3. **Parallel Phase**: Spawns gemini workers for execution
4. **Review Phase**: Returns to Gemini CLI for quality review
5. **Result Collection**: Aggregates worker results from memory

## Generated Commands

```bash
# Phase 1: Interactive (Gemini CLI)
# [Current session handles design/planning]

# Phase 2: Parallel (gemini)
{{#each workers}}
claude -p "{{this.task}}" --session-id {{this.id}} &
{{/each}}
wait

# Phase 3: Review (Gemini CLI)
npx gemiflow4gemini@v3alpha memory list --namespace results
```

## Example: Full Hybrid Workflow

```
/dual-coordinate --workflow hybrid_development --task "Build user profile API"
```

This will:
1. **Design Phase** (Interactive): Discuss requirements, design endpoints, plan implementation
2. **Implement Phase** (Headless): Spawn coders, testers, docs writers in parallel
3. **Review Phase** (Interactive): Review implementation, discuss improvements

## Related Skills

- `/dual-spawn` - Spawn headless workers only
- `/dual-collect` - Collect results from workers
