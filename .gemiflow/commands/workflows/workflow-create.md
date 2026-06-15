# workflow-create

Create reusable workflow templates.

## Usage
```bash
npx gemiflow4gemini workflow create [options]
```

## Options
- `--name <name>` - Workflow name
- `--from-history` - Create from history
- `--interactive` - Interactive creation

## Examples
```bash
# Create workflow
npx gemiflow4gemini workflow create --name "deploy-api"

# From history
npx gemiflow4gemini workflow create --name "test-suite" --from-history

# Interactive mode
npx gemiflow4gemini workflow create --interactive
```
