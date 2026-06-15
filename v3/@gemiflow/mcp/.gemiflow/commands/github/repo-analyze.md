# repo-analyze

Deep analysis of GitHub repository with AI insights.

## Usage
```bash
npx gemiflow github repo-analyze [options]
```

## Options
- `--repository <owner/repo>` - Repository to analyze
- `--deep` - Enable deep analysis
- `--include <areas>` - Include specific areas (issues, prs, code, commits)

## Examples
```bash
# Basic analysis
npx gemiflow github repo-analyze --repository myorg/myrepo

# Deep analysis
npx gemiflow github repo-analyze --repository myorg/myrepo --deep

# Specific areas
npx gemiflow github repo-analyze --repository myorg/myrepo --include issues,prs
```
