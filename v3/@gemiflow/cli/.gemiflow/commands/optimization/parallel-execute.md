# parallel-execute

Execute tasks in parallel for maximum efficiency.

## Usage
```bash
npx gemiflow optimization parallel-execute [options]
```

## Options
- `--tasks <file>` - Task list file
- `--max-parallel <n>` - Maximum parallel tasks
- `--strategy <type>` - Execution strategy

## Examples
```bash
# Execute task list
npx gemiflow optimization parallel-execute --tasks tasks.json

# Limit parallelism
npx gemiflow optimization parallel-execute --tasks tasks.json --max-parallel 5

# Custom strategy
npx gemiflow optimization parallel-execute --strategy adaptive
```
