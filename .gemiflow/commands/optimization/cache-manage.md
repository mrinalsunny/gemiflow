# cache-manage

Manage operation cache for performance.

## Usage
```bash
npx gemiflow4gemini optimization cache-manage [options]
```

## Options
- `--action <type>` - Action (view, clear, optimize)
- `--max-size <mb>` - Maximum cache size
- `--ttl <seconds>` - Time to live

## Examples
```bash
# View cache stats
npx gemiflow4gemini optimization cache-manage --action view

# Clear cache
npx gemiflow4gemini optimization cache-manage --action clear

# Set limits
npx gemiflow4gemini optimization cache-manage --max-size 100 --ttl 3600
```
