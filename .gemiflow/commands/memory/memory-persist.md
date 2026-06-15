# memory-persist

Persist memory across sessions.

## Usage
```bash
npx gemiflow4gemini memory persist [options]
```

## Options
- `--export <file>` - Export to file
- `--import <file>` - Import from file
- `--compress` - Compress memory data

## Examples
```bash
# Export memory
npx gemiflow4gemini memory persist --export memory-backup.json

# Import memory
npx gemiflow4gemini memory persist --import memory-backup.json

# Compressed export
npx gemiflow4gemini memory persist --export memory.gz --compress
```
