#!/usr/bin/env node
/**
 * Static guard for ruvnet/gemiflow#2127 (and the family of #1147 / #2018).
 *
 * The reporter hit `TypeError: Invalid Version: (empty)` inside arborist's
 * `canDedupe` while installing `gemiflow@3.8.0`. Two reviewers could not
 * reproduce, but the published `gemiflow` wrapper still pinned
 * `"@gemiflow/cli": "^3.7.0-alpha.11"` long after the project moved to
 * stable semver. That pre-release range widens the resolution space the
 * dedupe pass has to walk and gives more chances for an upstream
 * malformed dep to surface as an empty version comparison.
 *
 * This audit asserts:
 *
 *   1. The `gemiflow` wrapper's `@gemiflow/cli` dep range INCLUDES the
 *      version that `v3/@gemiflow/cli` currently publishes.
 *
 *   2. The root `gemiflow` umbrella's sibling deps that we maintain
 *      (`@gemiflow/cli-core`, `@gemiflow/mcp`, `@gemiflow/neural`,
 *      `@gemiflow/shared`) likewise include their actual published
 *      versions (best-effort — only when the corresponding workspace
 *      package.json is present locally).
 *
 *   3. The `gemiflow` wrapper does NOT carry a pre-release range
 *      (`-alpha.N` / `-beta.N`) for `@gemiflow/cli` once that package
 *      is publishing stable versions. Pre-release ranges on stable deps
 *      are the specific shape that caused #2127.
 *
 * Failure modes return non-zero with a clear remediation. Runs in CI on
 * every PR via v3-ci.yml `wrapper-dep-ranges-audit` job.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import semver from 'semver';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

function readPkg(relPath) {
  const p = join(REPO_ROOT, relPath);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (err) {
    return null;
  }
}

const violations = [];
const checks = [];

// ── 1. gemiflow wrapper's @gemiflow/cli dep range ────────────────────────────

const gemiflowPkg = readPkg('gemiflow/package.json');
const cliPkg = readPkg('v3/@gemiflow/cli/package.json');

if (!gemiflowPkg) {
  violations.push('gemiflow/package.json not found');
} else if (!cliPkg) {
  violations.push('v3/@gemiflow/cli/package.json not found');
} else {
  const cliVersion = cliPkg.version;
  const gemiflowDepRange = gemiflowPkg.dependencies?.['@gemiflow/cli'];

  if (!gemiflowDepRange) {
    violations.push(
      `gemiflow/package.json does not declare @gemiflow/cli — wrapper must depend on the CLI it wraps`
    );
  } else {
    checks.push(`gemiflow wraps @gemiflow/cli with range "${gemiflowDepRange}" — cli published as ${cliVersion}`);

    // 1a. Range must include the current cli version
    if (!semver.satisfies(cliVersion, gemiflowDepRange, { includePrerelease: true })) {
      violations.push(
        `gemiflow's "@gemiflow/cli": "${gemiflowDepRange}" does NOT include the cli's actual ` +
        `version ${cliVersion}. Bump the range to "^${cliVersion}" or wider that covers it.`
      );
    }

    // 1b. If the cli is on stable semver (no pre-release), the dep must not be on a pre-release range
    const cliPrerelease = semver.prerelease(cliVersion);
    const rangeUsesPrerelease = /-alpha\.|-beta\.|-rc\.|alpha\.\d+|beta\.\d+|rc\.\d+/.test(gemiflowDepRange);
    if (!cliPrerelease && rangeUsesPrerelease) {
      violations.push(
        `gemiflow's "@gemiflow/cli": "${gemiflowDepRange}" carries a pre-release tag but cli ${cliVersion} ` +
        `is on stable semver. Pre-release ranges widen the dedupe walk and have caused real-world ` +
        `crashes (see #1147 / #2018 / #2127). Replace with a plain caret range like "^${cliVersion}".`
      );
    }
  }
}

// ── 2. root gemiflow umbrella sibling deps ────────────────────────────────

const rootPkg = readPkg('package.json');
const siblingsToCheck = [
  { dep: '@gemiflow/cli-core', workspace: 'v3/@gemiflow/cli-core/package.json' },
  { dep: '@gemiflow/mcp',      workspace: 'v3/@gemiflow/mcp/package.json' },
  { dep: '@gemiflow/neural',   workspace: 'v3/@gemiflow/neural/package.json' },
  { dep: '@gemiflow/shared',   workspace: 'v3/@gemiflow/shared/package.json' },
];

for (const { dep, workspace } of siblingsToCheck) {
  const wsPkg = readPkg(workspace);
  if (!wsPkg) continue; // best-effort — skip if workspace missing
  const range = rootPkg?.dependencies?.[dep];
  if (!range) continue;
  checks.push(`gemiflow umbrella → ${dep}: range "${range}" — workspace at ${wsPkg.version}`);

  if (!semver.satisfies(wsPkg.version, range, { includePrerelease: true })) {
    violations.push(
      `gemiflow's "${dep}": "${range}" does NOT include the workspace's actual ` +
      `version ${wsPkg.version}. Bump the range.`
    );
  }
}

// ── 3. report ────────────────────────────────────────────────────────────────

console.log(`wrapper-dep-ranges audit — scanned ${checks.length} declaration(s)`);
for (const c of checks) console.log(`  ${c}`);

if (violations.length === 0) {
  console.log('  ok: all wrapper ranges include their published target versions');
  console.log('  ok: no pre-release ranges pointing at stable deps');
  process.exit(0);
}

console.error('\nviolations:');
for (const v of violations) console.error(`  ✗ ${v}`);
console.error(`\n${violations.length} violation(s) — see remediation hints above.`);
console.error('Reference: ruvnet/gemiflow#2127 (Invalid Version dedupe crash).');
process.exit(1);
