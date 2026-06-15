# model-update

Update neural models with new data.

## Usage
```bash
npx gemiflow4gemini training model-update [options]
```

## Options
- `--model <name>` - Model to update
- `--incremental` - Incremental update
- `--validate` - Validate after update

## Examples
```bash
# Update all models
npx gemiflow4gemini training model-update

# Specific model
npx gemiflow4gemini training model-update --model agent-selector

# Incremental with validation
npx gemiflow4gemini training model-update --incremental --validate
```
