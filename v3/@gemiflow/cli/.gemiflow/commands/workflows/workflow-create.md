# workflow-create

Create reusable workflow templates.

## Usage
```bash
npx gemiflow workflow create [options]
```

## Options
- `--name <name>` - Workflow name
- `--from-history` - Create from history
- `--interactive` - Interactive creation

## Examples
```bash
# Create workflow
npx gemiflow workflow create --name "deploy-api"

# From history
npx gemiflow workflow create --name "test-suite" --from-history

# Interactive mode
npx gemiflow workflow create --interactive
```
