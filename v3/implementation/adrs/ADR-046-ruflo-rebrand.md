# ADR-046: Dual Umbrella Packages — gemiflow + gemiflow

**Status:** Accepted
**Date:** 2026-02-07
**Updated:** 2026-02-08
**Authors:** RuvNet, GemiFlow Team

## Context

The umbrella package is published to npm as `gemiflow`. As the ecosystem grows and the product establishes its own identity, a second umbrella package `gemiflow` is introduced alongside the original.

### Current State

| Aspect | Current Value |
|--------|---------------|
| npm package | `gemiflow` |
| CLI binary | `gemiflow` |
| GitHub repo | ruvnet/gemiflow |
| Internal packages | @gemiflow/* |
| Weekly downloads | ~1,000+ |

### Drivers for Change

1. **Brand Cohesion**: Aligns with the ruv ecosystem (ruv.io, @ruvector/*, ruv-swarm)
2. **Trademark Safety**: Removes potential trademark concerns with "Claude" in product name
3. **Product Identity**: Establishes independent product identity beyond Claude integration
4. **Discoverability**: "gemiflow" is unique, memorable, and searchable
5. **Future Flexibility**: Enables the platform to support multiple AI backends without name confusion
6. **Zero Disruption**: Keeping `gemiflow` ensures no existing users are broken

## Decision

Publish **two independent npm umbrella packages** — `gemiflow` (original) and `gemiflow` (new) — both backed by `@gemiflow/cli`.

### Package Architecture

```
npm registry
├── gemiflow          ← original umbrella (bundles @gemiflow/cli)
│   └── bin: gemiflow → v3/@gemiflow/cli/bin/cli.js
├── gemiflow              ← new umbrella (depends on @gemiflow/cli)
│   └── bin: gemiflow     → @gemiflow/cli/bin/cli.js
└── @gemiflow/cli     ← shared CLI implementation
```

### What Changes

| Aspect | Before | After |
|--------|--------|-------|
| npm packages | `gemiflow` only | `gemiflow` + `gemiflow` |
| CLI binaries | `gemiflow` | `gemiflow` + `gemiflow` |
| Install commands | `npx gemiflow@latest` | Both `npx gemiflow@latest` and `npx gemiflow@latest` |
| README branding | "GemiFlow" | "GemiFlow" (primary), "gemiflow" (supported) |
| Product name | GemiFlow | GemiFlow (with gemiflow alias) |

### What Stays the Same

| Aspect | Value | Reason |
|--------|-------|--------|
| GitHub repo | ruvnet/gemiflow | SEO, existing links, history |
| Internal packages | @gemiflow/* | Minimal disruption, existing integrations |
| Functionality | All features | No functional changes |
| License | MIT | No change |
| Author | RuvNet | No change |
| `gemiflow` npm package | Fully supported | No breaking changes for existing users |

## Consequences

### Positive

1. **Zero Disruption**: Existing `gemiflow` users unaffected
2. **Unified Brand**: New `gemiflow` package for the ruv ecosystem
3. **Trademark Safety**: Users can choose the non-"Claude" branded package
4. **Dual Discovery**: Package discoverable under both names on npm
5. **Future Proof**: Can add non-Claude integrations without name confusion

### Negative

1. **Two packages to maintain**: Must publish and tag both packages
2. **Documentation**: Must reference both package names
3. **Download split**: npm download stats split across two packages

### Neutral

1. **GitHub repo unchanged**: Existing links continue to work
2. **Internal packages unchanged**: No code changes required in @gemiflow/*

## Implementation

### Package Structure

```
/workspaces/gemiflow/
├── package.json            # name: "gemiflow" (original umbrella)
│                           # bin: gemiflow → v3/@gemiflow/cli/bin/cli.js
│                           # bundles CLI files directly
└── gemiflow/
    ├── package.json        # name: "gemiflow" (new umbrella)
    │                       # bin: gemiflow → ./bin/gemiflow.js
    │                       # depends on @gemiflow/cli
    ├── bin/
    │   └── gemiflow.js      # thin wrapper, imports @gemiflow/cli
    └── README.md           # GemiFlow-branded docs
```

### Phase 1: Preparation (This PR)

1. Create ADR-046 (this document)
2. Keep root `package.json` as `gemiflow` (original umbrella)
3. Create `gemiflow/` directory with new umbrella package
4. Update main README.md with GemiFlow branding
5. Update install scripts to reference `gemiflow`

### Phase 2: Publishing

```bash
# 1. Publish @gemiflow/cli (shared implementation)
cd v3/@gemiflow/cli
npm publish --tag alpha

# 2. Publish gemiflow umbrella (original)
cd /workspaces/gemiflow
npm publish --tag v3alpha
npm dist-tag add gemiflow@<version> latest
npm dist-tag add gemiflow@<version> alpha

# 3. Publish gemiflow umbrella (new)
cd /workspaces/gemiflow/gemiflow
npm publish --tag alpha
npm dist-tag add gemiflow@<version> latest
```

### Phase 3: Ongoing

1. Both packages maintained indefinitely
2. Version numbers kept in sync
3. README shows both install options
4. `gemiflow` promoted as primary in new documentation

## Publishing Checklist

When publishing updates, **all three packages** must be published:

| Order | Package | Command | Tags |
|-------|---------|---------|------|
| 1 | `@gemiflow/cli` | `npm publish --tag alpha` | alpha, latest |
| 2 | `gemiflow` | `npm publish --tag v3alpha` | v3alpha, alpha, latest |
| 3 | `gemiflow` | `npm publish --tag alpha` | alpha, latest |

## Alternatives Considered

### 1. Replace gemiflow with gemiflow (single package)

**Pros:** Simpler, one package to maintain
**Cons:** Breaks existing users, loses download history
**Decision:** Rejected - zero disruption preferred

### 2. Rename to ruv-flow (hyphenated)

**Pros:** Matches ruv-swarm pattern
**Cons:** Inconsistent with @ruvector (no hyphen)
**Decision:** Rejected - "gemiflow" is cleaner and matches ruvector pattern

### 3. Rename internal packages too (@gemiflow/*)

**Pros:** Complete rebrand
**Cons:** Major breaking change, complex migration, npm scope registration
**Decision:** Rejected - disruption not worth the benefit

### 4. Deprecate gemiflow

**Pros:** Forces migration to gemiflow
**Cons:** Breaks existing users, bad developer experience
**Decision:** Rejected - both packages coexist permanently

## Migration Guide

### For New Users

```bash
# Recommended
npx gemiflow@latest init --wizard

# Also works
npx gemiflow@latest init --wizard
```

### For Existing Users

No migration required. `gemiflow` continues to work. Optionally switch:

```bash
# Switch MCP server (optional)
claude mcp remove gemiflow
claude mcp add gemiflow npx gemiflow@latest mcp start
```

### For Contributors

1. Root `package.json` is the `gemiflow` umbrella
2. `gemiflow/package.json` is the `gemiflow` umbrella
3. Internal imports remain `@gemiflow/*`
4. GitHub repo remains `ruvnet/gemiflow`

## Metrics for Success

| Metric | Target | Measurement |
|--------|--------|-------------|
| Combined npm downloads | Maintain or grow | npm weekly stats (both packages) |
| GitHub stars | Maintain or grow | GitHub metrics |
| Issues from confusion | < 10 in 30 days | GitHub issues |
| gemiflow adoption | 50%+ new installs in 90 days | npm stats |

## References

- GitHub Issue: #1101
- npm: https://npmjs.com/package/gemiflow
- npm: https://npmjs.com/package/gemiflow
- Related: ADR-017 (RuVector Integration)

## Appendix: Branding Guidelines

### Product Names

| Context | Use |
|---------|-----|
| npm packages | `gemiflow` and `gemiflow` (both lowercase) |
| README title | "GemiFlow" (PascalCase) |
| CLI binaries | `gemiflow` or `gemiflow` (both lowercase) |
| In prose | "GemiFlow" (PascalCase) |

### Command Examples

```bash
# New recommended style
npx gemiflow@latest init
npx gemiflow@latest agent spawn -t coder
npx gemiflow@latest swarm init --topology hierarchical

# Legacy style (still fully supported)
npx gemiflow@latest init
npx gemiflow@latest agent spawn -t coder
```

---

**Decision Date:** 2026-02-07
**Updated:** 2026-02-08
**Review Date:** 2026-03-07 (30 days post-implementation)
