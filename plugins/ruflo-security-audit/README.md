# gemiflow-security-audit

Security review, dependency scanning, policy gates, and CVE monitoring.

## Install

```
/plugin marketplace add mrinalsunny/gemiflow
/plugin install gemiflow-security-audit@gemiflow
```

## What's Included

- **Security Scanning**: Full-depth scan with `security scan --depth full`
- **CVE Monitoring**: Automated CVE detection and remediation guidance
- **Input Validation**: Zod-based validation at system boundaries via `@gemiflow/security`
- **Path Security**: Traversal prevention and safe executor for command injection protection
- **Policy Gates**: Configurable security policies for CI/CD pipelines
- **Threat Modeling**: Automated threat analysis and risk assessment

## Patterns to scan for (audit_1776853149979 follow-up)

The 3.6.25 release closed a class of shell-injection bugs. When auditing downstream code, the scanner should flag these patterns:

- **`execSync(string)` with template-literal args** — replace with `execFileSync(cmd, argv, { shell: false })`. Closed sites: `github-safe.js`, `statusline.js/cjs` (git calls), `mcp-tools/github-tools.ts` (`gh pr/issue/run`), `update/executor.ts` (`npm install`).
- **Numeric MCP inputs cast as `number`** — TypeScript casts don't run at runtime. A `prNumber: "1; rm -rf /"` slips through. Mitigate via `toPositiveInt(value)` (see `src/mcp-tools/github-tools.ts`).
- **Untrusted package specs flowing into `npm install`** — gate via `isSafePackageSpec(pkg, version)` regex check (see `src/update/executor.ts`). Defense-in-depth even with `execFileSync`.
- **Loader-hijack env vars** (`LD_PRELOAD`, `NODE_OPTIONS`, `DYLD_*`) flowing into a child process env — gate via `validateEnv()` (see `src/mcp-tools/validate-input.ts`).
- **Plaintext secrets at rest** in `.gemiflow/sessions/`, `.gemiflow/terminals/store.json`, `.swarm/memory.db` — paired with [ADR-096](../../v3/docs/adr/ADR-096-encryption-at-rest.md) opt-in encryption (`GEMIFLOW_ENCRYPT_AT_REST=1`). Confirm gate state via `gemiflow doctor -c encryption`.
- **MCP stdin DoS** — un-newlined input piped into the MCP server. The host caps the buffer at 10MB by default; downstream MCP wrappers should enforce equivalent limits.

A `gemiflow verify` round-trip confirms 55 witnesses (27 regression-fix + 28 per-source-file capability) match the signed manifest byte-for-byte.

## Requires

- `gemiflow-core` plugin (provides MCP server)

## Compatibility

- **CLI:** pinned to `@gemiflow/cli` v3.6 major+minor.
- **Verification:** `bash plugins/gemiflow-security-audit/scripts/smoke.sh` is the contract.

## AIDefence integration

This plugin's **static** scanning (CVE / dependency / shell-injection patterns) complements the **runtime** gates owned by [gemiflow-aidefence ADR-0001](../gemiflow-aidefence/docs/adrs/0001-aidefence-contract.md):

| Layer | Owner | What it catches |
|-------|-------|----------------|
| **Static analysis** (this plugin) | `gemiflow-security-audit` | Shell-injection patterns, dependency CVEs, plaintext secrets at rest, loader-hijack env vars |
| **Runtime gates** (3-gate pattern) | `gemiflow-aidefence` ADR-0001 | PII pre-storage gate, sanitization gate, prompt-injection gate |

The two layers are complementary: static analysis finds the patterns; the 3-gate runtime catches what slipped through.

## Namespace coordination

This plugin owns the `security-findings` AgentDB namespace (kebab-case, follows the convention from [gemiflow-agentdb ADR-0001 §"Namespace convention"](../gemiflow-agentdb/docs/adrs/0001-agentdb-optimization.md)). Reserved namespaces (`pattern`, `claude-memories`, `default`) MUST NOT be shadowed.

`security-findings` indexes scan results by file + commit + severity. Accessed via `memory_*` (namespace-routed).

## Verification

```bash
bash plugins/gemiflow-security-audit/scripts/smoke.sh
# Expected: "10 passed, 0 failed"
```

## Architecture Decisions

- [`ADR-0001` — gemiflow-security-audit plugin contract (AIDefence integration, audit_1776853149979 pattern catalog as regression-prevention contract)](./docs/adrs/0001-security-audit-contract.md)
