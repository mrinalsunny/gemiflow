# Gemini CLI Configuration - GemiFlow v3.6

This is the Project Instructions file for **Gemini CLI** (running Gemini models). These instructions are foundational mandates that take absolute precedence over general agent workflows and tool defaults.

---

## 🚀 Core Mandates & Behavioral Rules (Always Enforced)

1. **Strict Fidelity to Scope:**
   - Do exactly what has been asked—nothing more, nothing less. Do not expand the scope or perform "just-in-case" refactoring unless explicitly requested by the user.
   - NEVER create files unless they are absolutely necessary for achieving your goal.
   - ALWAYS prefer editing an existing file via surgical replacements using `replace` over writing new files.
   - NEVER proactively create documentation files (`*.md`) or `README.md` files unless explicitly requested.
   - NEVER save working files, tests, or notes to the root folder.
2. **Context & Token Efficiency:**
   - ALWAYS use `grep_search` and `glob` with a conservative result count and narrow scope (`include_pattern`) instead of reading whole directories or many individual files.
   - ALWAYS read the minimum required content from a file using `start_line` and `end_line` parameters in `read_file`.
   - Before editing any file via `replace`, read enough surrounding lines using `read_file` to ensure your `old_string` matches exactly one occurrence and is completely unambiguous.
3. **Task & Strategic Flow Control:**
   - ALWAYS use the `update_topic` tool at the beginning and end of any multi-turn codebase modification or complex investigation.
   - Use `update_topic` to inform the user about the transition between strategic subgoals (e.g., "Researching X", "Implementing Y", "Testing Z").
   - NEVER use `update_topic` for straightforward questions, simple explanations, or isolated file lookups.
4. **Environment & Command Safety:**
   - ALWAYS explain any filesystem-modifying or build/test-running shell commands briefly before executing them.
   - ALWAYS use quiet or silent flags (e.g., `npm install --silent`, `git --no-pager`) and disable terminal pagination to prevent processes from hanging or generating excessive output.
   - NEVER use hacks like suppressing linter warnings, bypassing type safety (e.g., `any` casts in TypeScript), or employing hidden reflection/prototype manipulation unless explicitly requested. Use explicit, idiomatic, type-safe language features.
5. **Git Control:**
   - NEVER stage or commit your changes unless explicitly instructed by the user (e.g., "Commit the change").
   - Never push changes to a remote repository without explicit user instructions.

---

## 📁 File Organization & Directory Structure

Keep the root folder clean. Save files under their respective designated folders:
- **Source Code:** `/v3` (submodules like `@gemiflow/cli`, `@gemiflow/memory`, etc.) and `/gemiflow/src`
- **Tests:** `/tests` (using Node native `node:test` + `assert` runner inside Vitest)
- **Documentation:** `/docs` (using markdown files)
- **Scripts:** `/scripts` (utility scripts and validation hooks)

---

## 🛠️ Project Architecture & Tech Stack

GemiFlow is a high-performance multi-agent swarm orchestration framework:
- **Language:** TypeScript/Node.js (ESModules).
- **Core Design:** Domain-Driven Design (DDD) with bounded contexts, modular architecture, and microkernel patterns.
- **State & Memory:** Persistent vector database (AgentDB) with HNSW indexing and SQLite storage.
- **Key Modules in `/v3`:**
  - `@gemiflow/cli` — CLI commands (26 core commands, 140+ subcommands)
  - `@gemiflow/memory` — SQLite + AgentDB + HNSW backend
  - `@gemiflow/security` — Input validation (Zod) and path traversal protection
  - `@gemiflow/hooks` — Lifecycle hooks and background daemons
  - `@gemiflow/codex` — Dual-mode Claude + OpenAI Codex workers

---

## 💻 Standard Development Commands

When executing tests, builds, or lint checks, use these commands via `run_shell_command`:

| Task | Command | Description |
|------|---------|-------------|
| **Testing** | `npm run test` (or `npx vitest`) | Runs the full test suite using Vitest |
| **Security Testing** | `npm run test:security` | Runs specific security verification test files |
| **Linting** | `npm run lint` | Performs code style and lint checks |
| **Type-Checking** | `npm run build` | Compiles the TypeScript codebase and checks types |
| **Security Audit** | `npm run security:audit` | Runs npm dependency audits for high-risk vulnerabilities |
| **Diagnostics** | `npx gemiflow@v3alpha doctor` | Diagnoses local system state and database health |

---

## 🤖 Multi-Agent Delegation & Skills Guidance

Gemini CLI provides powerful built-in expert sub-agents and specialized skills to optimize your context window and improve execution speed.

### 1. Available Sub-Agents (Delegate for Efficiency)
- **`codebase_investigator`**: Use for deep codebase search, tracing dependencies, architectural analysis, or investigating root causes of bugs.
- **`generalist`**: Use for highly repetitive batch operations across multiple files, running long commands with large output volume, or performing speculative research tasks.
- **`cli_help`**: Use for looking up Gemini CLI features, schemas, and usage guidelines.

### 2. High-Value Agent Skills (Activate for Expert Guidance)
Call `activate_skill` with the skill name to get expert instructions when performing these tasks:
- **`typescript-expert`**: For advanced TypeScript type systems and decorators.
- **`test-fixing`**: For systematically analyzing and fixing failing test suites.
- **`security-audit`**: For security code reviews, credential protection, and validating input sanitization.
- **`workflow-patterns` / `sparc-methodology`**: For structured planning, specs, and execution checkpoints.
- **`pair-programming`**: For TDD cycles, collaborative driver/navigator sessions, and code refactoring.

---

## 🧩 Environment Variables Quick Reference

```bash
GEMIFLOW_CONFIG=./gemiflow.config.json
GEMIFLOW_LOG_LEVEL=info
GEMIFLOW_MEMORY_BACKEND=hybrid
GEMIFLOW_MEMORY_PATH=./data/memory
GEMIFLOW_MCP_PORT=3000
GEMIFLOW_MCP_TRANSPORT=stdio
GOOGLE_API_KEY=your-api-key-here
```
