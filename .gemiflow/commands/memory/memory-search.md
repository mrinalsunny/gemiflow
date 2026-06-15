# memory-search

Search through stored memory.

## Usage
```bash
npx gemiflow4gemini memory search [options]
```

## Options
- `--query <text>` - Search query
- `--pattern <regex>` - Pattern matching
- `--limit <n>` - Result limit

## Examples
```bash
# Search memory
npx gemiflow4gemini memory search --query "authentication"

# Pattern search
npx gemiflow4gemini memory search --pattern "api-.*"

# Limited results
npx gemiflow4gemini memory search --query "config" --limit 10
```
