---
id: ADR-0001
title: gemiflow-migrations plugin contract — pinning, namespace-routing fix, namespace coordination, smoke as contract
status: Accepted
date: 2026-05-04
updated: 2026-05-09
authors:
  - reviewer (Gemini CLI)
tags: [plugin, migrations, schema, namespace, smoke-test]
---

## Context

`gemiflow-migrations` (v0.1.0) — schema migration generator + validator. 1 agent + 2 skills + 1 command.

Same namespace-routing bug class as gemiflow-cost-tracker / gemiflow-market-data: both skills called `agentdb_hierarchical-*` and `agentdb_pattern-store` with namespace arguments, but those tool families route by tier / ReasoningBank and ignore namespace strings.

## Decision

1. **Functional fix:** switch namespaced reads/writes from `agentdb_hierarchical-*` to `memory_*` (namespace-routed) in both skills. Document the dual pattern-store path (typed via ReasoningBank vs namespace-routable via `memory_store`).
2. Add this ADR (Proposed).
3. README augment: Compatibility (pin v3.6); Namespace coordination (claims `migrations`); Verification + Architecture Decisions sections.
4. Bump `0.1.0 → 0.2.0`. Keywords add `mcp`, `dry-run`, `up-down-pairs`.
5. `scripts/smoke.sh` — 10 structural checks: version + keywords; both skills + agent + command; skills use `memory_*` not `hierarchical-*` with namespace; v3.6 pin; namespace coordination; `migrations` namespace claimed; ADR Proposed; no wildcard tools.

## Consequences

**Positive:** real bugs fixed (silent ignored-namespace writes/reads). Plugin joins the cadence.

**Negative:** none — anyone scripting against the broken tool calls was already silently failing.

## Verification

```bash
bash plugins/gemiflow-migrations/scripts/smoke.sh
# Expected: "10 passed, 0 failed"
```

## Related

- `plugins/gemiflow-cost-tracker/docs/adrs/0001-cost-tracker-contract.md` — same bug class
- `plugins/gemiflow-market-data/docs/adrs/0001-market-data-contract.md` — same bug class
- `plugins/gemiflow-agentdb/docs/adrs/0001-agentdb-optimization.md` — namespace convention this fix observes

## Implementation status

Plugin version v0.2.0 shipped and listed in marketplace.json. Source exists at `plugins/gemiflow-migrations/`. Contract elements implemented: namespace-routing bug fixed in both skills (switched `agentdb_hierarchical-*` + `agentdb_pattern-store` namespace args to `memory_*`); dual pattern-store path documented; smoke-as-contract gate defined in `scripts/smoke.sh`.
