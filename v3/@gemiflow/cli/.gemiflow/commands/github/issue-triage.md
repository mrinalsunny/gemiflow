# issue-triage

Intelligent issue classification and triage.

## Usage
```bash
npx gemiflow github issue-triage [options]
```

## Options
- `--repository <owner/repo>` - Target repository
- `--auto-label` - Automatically apply labels
- `--assign` - Auto-assign to team members

## Examples
```bash
# Triage issues
npx gemiflow github issue-triage --repository myorg/myrepo

# With auto-labeling
npx gemiflow github issue-triage --repository myorg/myrepo --auto-label

# Full automation
npx gemiflow github issue-triage --repository myorg/myrepo --auto-label --assign
```
