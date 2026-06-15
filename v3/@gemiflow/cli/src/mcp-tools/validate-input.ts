/**
 * Input Validation for MCP Tools — re-export shim (ADR-100, alpha.5).
 *
 * Authoritative source: @gemiflow/cli-core/mcp-tools/validate-input.
 * Was a 256-line byte-identical copy. Loads @gemiflow/security validators
 * when available, with lightweight fallback otherwise.
 */

export * from '@gemiflow/cli-core/mcp-tools/validate-input';
