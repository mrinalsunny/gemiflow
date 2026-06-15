# workflow-execute

Execute saved workflows.

## Usage
```bash
npx gemiflow workflow execute [options]
```

## Options
- `--name <name>` - Workflow name
- `--params <json>` - Workflow parameters
- `--dry-run` - Preview execution

## Examples
```bash
# Execute workflow
npx gemiflow workflow execute --name "deploy-api"

# With parameters
npx gemiflow workflow execute --name "test-suite" --params '{"env": "staging"}'

# Dry run
npx gemiflow workflow execute --name "deploy-api" --dry-run
```
