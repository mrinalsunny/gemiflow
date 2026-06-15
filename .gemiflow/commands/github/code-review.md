# code-review

Automated code review with swarm intelligence.

## Usage
```bash
npx gemiflow4gemini github code-review [options]
```

## Options
- `--pr-number <n>` - Pull request to review
- `--focus <areas>` - Review focus (security, performance, style)
- `--suggest-fixes` - Suggest code fixes

## Examples
```bash
# Review PR
npx gemiflow4gemini github code-review --pr-number 456

# Security focus
npx gemiflow4gemini github code-review --pr-number 456 --focus security

# With fix suggestions
npx gemiflow4gemini github code-review --pr-number 456 --suggest-fixes
```
