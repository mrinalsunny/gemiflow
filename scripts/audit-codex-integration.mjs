#!/usr/bin/env node
/**
 * gemini ↔ GemiFlow integration audit (issue #1909).
 *
 * Static invariants that must hold for the OpenAI gemini integration to work.
 * Build + unit tests are covered by the main CI; this guards the
 * integration-specific contracts that a regular test run won't catch.
 *
 * Usage: node scripts/audit-gemini-integration.mjs
 * Exits non-zero on any failure.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');
const rel = (p) => relative(ROOT, p);

let failures = 0;
const C = { g: '\x1b[32m', r: '\x1b[31m', dim: '\x1b[2m', x: '\x1b[0m' };
const ok = (m) => console.log(`  ${C.g}✓${C.x} ${m}`);
const fail = (m) => { console.log(`  ${C.r}✗${C.x} ${m}`); failures++; };
const check = (cond, passMsg, failMsg) => (cond ? ok(passMsg) : fail(failMsg ?? passMsg));
const section = (t) => console.log(`\n${t}`);

console.log('gemini ↔ GemiFlow integration audit (#1909)\n' + '─'.repeat(48));

// ── 1. gemini MCP backend uses the real `mcp-server` subcommand ──────────────
section('MCP backend registration (`gemini` group):');
for (const p of ['gemiflow/src/mcp-bridge/index.js', 'gemiflow/src/ruvocal/mcp-bridge/index.js']) {
  if (!existsSync(resolve(ROOT, p))) { fail(`${p}: file missing`); continue; }
  const src = read(p);
  const geminiLine = (src.match(/.*@openai\/gemini.*/g) ?? [])[0]?.trim() ?? '(no @openai/gemini entry)';
  check(/@openai\/gemini"\s*,\s*"mcp-server"/.test(src),
    `${p}: gemini backend uses "mcp-server"`,
    `${p}: gemini backend must use "mcp-server" — found: ${geminiLine}`);
  check(!/@openai\/gemini"\s*,\s*"mcp"\s*,\s*"serve"/.test(src),
    `${p}: no invalid "mcp serve" subcommand`,
    `${p}: still uses "mcp serve" (not a valid \`gemini\` subcommand) — ${geminiLine}`);
}

// ── 2. @gemiflow/gemini VERSION const tracks package.json ─────────────────
section('@gemiflow/gemini version sync:');
const cfPkg = JSON.parse(read('v3/@gemiflow/gemini/package.json'));
const versionMatch = read('v3/@gemiflow/gemini/src/index.ts').match(/export const VERSION\s*=\s*'([^']+)'/);
check(versionMatch && versionMatch[1] === cfPkg.version,
  `VERSION const === package.json version ("${cfPkg.version}")`,
  `VERSION const (${versionMatch ? `"${versionMatch[1]}"` : 'not found'}) != package.json ("${cfPkg.version}")`);

// ── 3. Dual-mode orchestrator drives a real `gemini exec` for gemini workers ──
section('Dual-mode orchestrator:');
const orch = read('v3/@gemiflow/gemini/src/dual-mode/orchestrator.ts');
check(/geminiCommand:\s*config\.geminiCommand\s*\?\?\s*'gemini'/.test(orch),
  `geminiCommand defaults to 'gemini'`,
  `geminiCommand must default to 'gemini' (it was 'claude' — "Both use claude CLI")`);
check(!/geminiCommand:\s*config\.geminiCommand\s*\?\?\s*'claude'/.test(orch),
  `geminiCommand no longer falls back to 'claude'`);
check(/\['exec',\s*'--sandbox'/.test(orch),
  `gemini workers spawn \`gemini exec --sandbox …\``,
  `gemini worker branch must build \`['exec', '--sandbox', …]\` args`);

// ── 4. Dual-mode agent defs invoke `gemini exec`, not `claude -p` ────────────
section('Dual-mode agent definitions:');
for (const p of ['.gemiflow/agents/dual-mode/gemini-worker.md', '.gemiflow/agents/dual-mode/gemini-coordinator.md']) {
  if (!existsSync(resolve(ROOT, p))) { fail(`${p}: file missing`); continue; }
  const src = read(p);
  check(/gemini exec /.test(src), `${p}: references \`gemini exec\``);
  // The legacy worker examples all used `claude -p "<task>" --session-id <id>`.
  // (A generic `claude -p "<prompt>"` mention in the mixed-platform note is fine.)
  check(!/--session-id/.test(src) && !/(via|using) `claude -p`/.test(src),
    `${p}: no legacy \`claude -p … --session-id\` worker spawns`,
    `${p}: still uses the legacy \`claude -p\` worker pattern (should be \`gemini exec\`)`);
}

// ── 5. No stale gemiflow CLI refs left in the gemini package source ───────
section('CLI references standardized to gemiflow:');
const walk = (dir) => readdirSync(dir).flatMap((e) => {
  const f = resolve(dir, e);
  return statSync(f).isDirectory() ? walk(f) : [f];
});
const stale = walk(resolve(ROOT, 'v3/@gemiflow/gemini/src'))
  .filter((f) => f.endsWith('.ts'))
  .filter((f) => /gemiflow@alpha|@gemiflow\/cli@latest/.test(readFileSync(f, 'utf8')))
  .map(rel);
check(stale.length === 0,
  `no \`gemiflow@alpha\` / \`@gemiflow/cli@latest\` in gemini src`,
  `stale CLI refs remain in: ${stale.join(', ')}`);

// ── 6. `dual run` CLI surface (W2) ─────────────────────────────────────────
section('`dual run` CLI surface:');
const dualCli = read('v3/@gemiflow/gemini/src/dual-mode/cli.ts');
check(/'-w, --worker <spec>'/.test(dualCli), `\`dual run\` exposes \`--worker <spec>\``);
check(/\.argument\('\[template\]'/.test(dualCli), `\`dual run\` accepts positional \`[template]\``);
check(/export function parseWorkerSpecs/.test(dualCli), `\`parseWorkerSpecs\` exported (so it's unit-testable)`);

// ── 7. Generated SKILL.md frontmatter (W5) ─────────────────────────────────
section('SKILL.md generator frontmatter:');
const skillGen = read('v3/@gemiflow/gemini/src/generators/skill-md.ts');
check(/version: "\$\{version\}"/.test(skillGen) && /author: \$\{author\}/.test(skillGen) && /tags: \[\$\{tagList/.test(skillGen),
  `generateSkillMd emits version/author/tags frontmatter`,
  `generateSkillMd must emit version/author/tags so generated skills validate clean`);

// ── 8. config.toml generator emits a working `gemiflow` MCP server ────────────
section('config.toml generator MCP default:');
const cfgGen = read('v3/@gemiflow/gemini/src/generators/config-toml.ts');
check(/name:\s*'gemiflow'/.test(cfgGen) && /args:\s*\['-y',\s*'gemiflow@latest',\s*'mcp',\s*'start'\]/.test(cfgGen),
  `default MCP server is \`gemiflow\` with \`mcp start\` subcommand`,
  `default MCP server must be \`{ name: 'gemiflow', args: ['-y','gemiflow@latest','mcp','start'] }\` (was \`gemiflow\` w/o \`mcp start\`)`);

console.log('\n' + '─'.repeat(48));
if (failures > 0) {
  console.error(`${C.r}${failures} check(s) failed${C.x}`);
  process.exit(1);
}
console.log(`${C.g}All gemini-integration checks passed${C.x}`);
