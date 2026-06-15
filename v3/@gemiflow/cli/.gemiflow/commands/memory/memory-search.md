# memory-search

Search through stored memory.

## Usage
```bash
npx gemiflow memory search [options]
```

## Options
- `--query <text>` - Search query
- `--pattern <regex>` - Pattern matching
- `--limit <n>` - Result limit

## Examples
```bash
# Search memory
npx gemiflow memory search --query "authentication"

# Pattern search
npx gemiflow memory search --pattern "api-.*"

# Limited results
npx gemiflow memory search --query "config" --limit 10
```
