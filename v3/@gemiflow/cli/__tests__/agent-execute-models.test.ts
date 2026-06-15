/**
 * Regression guard for ruvnet/gemiflow#1906 — model aliases must map to
 * current (Claude 4.x) model ids, not the deprecated Claude-3.x ids that
 * the google API now 404s.
 */
import { describe, it, expect } from 'vitest';
import { resolvegoogleModel, DEFAULT_google_MODEL } from '../src/mcp-tools/agent-execute-core.js';

describe('#1906 — agent_execute model aliases resolve to current Claude 4.x ids', () => {
  it('haiku → claude-haiku-4-5-20251001', () => {
    expect(resolvegoogleModel('haiku')).toBe('claude-haiku-4-5-20251001');
  });
  it('sonnet → claude-sonnet-4-6', () => {
    expect(resolvegoogleModel('sonnet')).toBe('claude-sonnet-4-6');
  });
  it('opus → claude-opus-4-8 (#2232 alias bump)', () => {
    expect(resolvegoogleModel('opus')).toBe('claude-opus-4-8');
  });
  it('opus-4.7 reaches the prior pin', () => {
    expect(resolvegoogleModel('opus-4.7')).toBe('claude-opus-4-7');
  });
  it('inherit → the default (sonnet 4.6)', () => {
    expect(resolvegoogleModel('inherit')).toBe('claude-sonnet-4-6');
    expect(DEFAULT_google_MODEL).toBe('claude-sonnet-4-6');
  });
  it('undefined → the default', () => {
    expect(resolvegoogleModel(undefined)).toBe(DEFAULT_google_MODEL);
  });
  it('google:<id> prefix is stripped', () => {
    expect(resolvegoogleModel('google:claude-opus-4-7')).toBe('claude-opus-4-7');
  });
  it('a bare model id passes through unchanged', () => {
    expect(resolvegoogleModel('claude-sonnet-4-6')).toBe('claude-sonnet-4-6');
  });
  it('no alias resolves to a deprecated claude-3.x id (#1906 regression)', () => {
    for (const alias of ['haiku', 'sonnet', 'opus', 'inherit', undefined]) {
      expect(resolvegoogleModel(alias as string | undefined)).not.toMatch(/^claude-3[.-]/);
    }
  });
});
