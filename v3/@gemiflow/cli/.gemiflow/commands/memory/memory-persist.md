# memory-persist

Persist memory across sessions.

## Usage
```bash
npx gemiflow memory persist [options]
```

## Options
- `--export <file>` - Export to file
- `--import <file>` - Import from file
- `--compress` - Compress memory data

## Examples
```bash
# Export memory
npx gemiflow memory persist --export memory-backup.json

# Import memory
npx gemiflow memory persist --import memory-backup.json

# Compressed export
npx gemiflow memory persist --export memory.gz --compress
```
