# workflow-execute

Execute saved workflows.

## Usage
```bash
npx gemiflow4gemini workflow execute [options]
```

## Options
- `--name <name>` - Workflow name
- `--params <json>` - Workflow parameters
- `--dry-run` - Preview execution

## Examples
```bash
# Execute workflow
npx gemiflow4gemini workflow execute --name "deploy-api"

# With parameters
npx gemiflow4gemini workflow execute --name "test-suite" --params '{"env": "staging"}'

# Dry run
npx gemiflow4gemini workflow execute --name "deploy-api" --dry-run
```
