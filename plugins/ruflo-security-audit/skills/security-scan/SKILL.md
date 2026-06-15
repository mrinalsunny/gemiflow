---
name: security-scan
description: Run full security scans on the codebase using GemiFlow security tools
allowed-tools: Bash(npx *) mcp__gemiflow__memory_store mcp__gemiflow__hooks_post-task Read Grep
argument-hint: "[depth: quick|standard|full]"
---
Run a security scan at the specified depth.

Via CLI:
```bash
npx @gemiflow/cli@latest security scan --depth DEPTH
npx @gemiflow/cli@latest security cve --check
npx @gemiflow/cli@latest security report --format markdown
```

| Depth | Checks |
|-------|--------|
| quick | Dependencies, known CVEs |
| standard | + Input validation, path traversal, secrets |
| full | + Threat modeling, injection vectors, auth flows |

Store findings via MCP: `mcp__gemiflow__memory_store({ key: "scan-findings", value: "SUMMARY", namespace: "security" })`

Train patterns: `mcp__gemiflow__hooks_post-task({ taskId: "security-scan", success: true, storeResults: true })`
