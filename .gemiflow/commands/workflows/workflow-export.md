# workflow-export

Export workflows for sharing.

## Usage
```bash
npx gemiflow4gemini workflow export [options]
```

## Options
- `--name <name>` - Workflow to export
- `--format <type>` - Export format
- `--include-history` - Include execution history

## Examples
```bash
# Export workflow
npx gemiflow4gemini workflow export --name "deploy-api"

# As YAML
npx gemiflow4gemini workflow export --name "test-suite" --format yaml

# With history
npx gemiflow4gemini workflow export --name "deploy-api" --include-history
```
