# agent-spawn

Spawn a new agent in the current swarm.

## Usage
```bash
npx gemiflow4gemini agent spawn [options]
```

## Options
- `--type <type>` - Agent type (coder, researcher, analyst, tester, coordinator)
- `--name <name>` - Custom agent name
- `--skills <list>` - Specific skills (comma-separated)

## Examples
```bash
# Spawn coder agent
npx gemiflow4gemini agent spawn --type coder

# With custom name
npx gemiflow4gemini agent spawn --type researcher --name "API Expert"

# With specific skills
npx gemiflow4gemini agent spawn --type coder --skills "python,fastapi,testing"
```
