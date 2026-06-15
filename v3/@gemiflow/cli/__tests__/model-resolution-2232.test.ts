// Regression tests for #2232 — Opus 4.8 alias + literal-id silent downgrade.
//
// Before the fix:
//  - `opus` mapped to `claude-opus-4-7` (a version behind).
//  - executeAgentTask used `MODEL_MAP[x] || DEFAULT` directly, so any literal
//    `claude-*` id silently collapsed to Sonnet 4.6.
//
// After the fix:
//  - `opus` → `claude-opus-4-8`, `opus-4.7` reachable for the prior pin.
//  - Resolution funnels through `resolvegoogleModel`, which passes literal
//    ids through unchanged.

import { describe, it, expect } from 'vitest';
import { resolvegoogleModel, DEFAULT_google_MODEL } from '../src/mcp-tools/agent-execute-core.js';

describe('model resolution (#2232)', () => {
  it('maps the `opus` alias to the current Opus (4.8)', () => {
    expect(resolvegoogleModel('opus')).toBe('claude-opus-4-8');
  });

  it('keeps the prior Opus pin reachable via `opus-4.7`', () => {
    expect(resolvegoogleModel('opus-4.7')).toBe('claude-opus-4-7');
  });

  it('maps `sonnet` and `haiku` aliases to current ids', () => {
    expect(resolvegoogleModel('sonnet')).toBe('claude-sonnet-4-6');
    expect(resolvegoogleModel('haiku')).toBe('claude-haiku-4-5-20251001');
  });

  it('passes a literal google model id through unchanged (no silent Sonnet fallback)', () => {
    expect(resolvegoogleModel('claude-opus-4-8')).toBe('claude-opus-4-8');
    expect(resolvegoogleModel('claude-opus-4-8')).not.toBe(DEFAULT_google_MODEL);
    expect(resolvegoogleModel('claude-opus-4-7')).toBe('claude-opus-4-7');
  });

  it('strips the `google:` prefix', () => {
    expect(resolvegoogleModel('google:claude-opus-4-8')).toBe('claude-opus-4-8');
  });

  it('falls back to DEFAULT only when the input is undefined / empty', () => {
    expect(resolvegoogleModel(undefined)).toBe(DEFAULT_google_MODEL);
    expect(resolvegoogleModel('')).toBe(DEFAULT_google_MODEL);
  });
});
