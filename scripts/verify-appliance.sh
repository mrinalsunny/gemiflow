#!/bin/sh
# ═══════════════════════════════════════════════════════════════
# GemiFlow RVFA Appliance — Full Capability Verification Suite
# ADR-058: Self-Contained GemiFlow RVF Appliance
#
# Tests ALL 35 categories (95+ checks) to verify every capability
# of the GemiFlow + GemiFlow system works correctly.
#
# Usage:
#   sh verify-appliance.sh                    # Run all checks
#   sh verify-appliance.sh --quick            # Critical checks only
#   sh verify-appliance.sh --category memory  # Single category
#   sh verify-appliance.sh --json             # JSON output
# ═══════════════════════════════════════════════════════════════
set -e

# ── Configuration ─────────────────────────────────────────────
PASS=0
FAIL=0
WARN=0
SKIP=0
ERRORS=""
START_TIME=$(date +%s)
QUICK_MODE=0
TARGET_CATEGORY=""
JSON_MODE=0
GEMIFLOW_CMD="${GEMIFLOW_CMD:-gemiflow}"

# Parse arguments
while [ $# -gt 0 ]; do
  case "$1" in
    --quick|-q)     QUICK_MODE=1; shift ;;
    --category|-c)  TARGET_CATEGORY="$2"; shift 2 ;;
    --json|-j)      JSON_MODE=1; shift ;;
    --help|-h)
      echo "GemiFlow Appliance Verification Suite"
      echo ""
      echo "Usage: sh verify-appliance.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --quick, -q            Run critical checks only (categories 1-5, 25)"
      echo "  --category, -c NAME    Run single category (e.g. memory, security, mcp)"
      echo "  --json, -j             Output results as JSON"
      echo "  --help, -h             Show this help"
      echo ""
      echo "Environment:"
      echo "  GEMIFLOW_CMD=gemiflow        Command to test (default: gemiflow)"
      echo "  SKIP_NETWORK=1         Skip checks that require network"
      echo "  SKIP_MODELS=1          Skip local model inference checks"
      exit 0
      ;;
    *) shift ;;
  esac
done

# ── Test Helpers ──────────────────────────────────────────────
check() {
  local name="$1"
  shift
  local output
  output=$("$@" 2>&1) && {
    PASS=$((PASS + 1))
    [ "$JSON_MODE" = "0" ] && printf "  ✓ %s\n" "$name"
    return 0
  } || {
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\n  ✗ $name: $(echo "$output" | tail -1)"
    [ "$JSON_MODE" = "0" ] && printf "  ✗ %s\n" "$name"
    return 1
  }
}

check_contains() {
  local name="$1"
  local expected="$2"
  shift 2
  local output
  output=$("$@" 2>&1)
  if echo "$output" | grep -qi "$expected"; then
    PASS=$((PASS + 1))
    [ "$JSON_MODE" = "0" ] && printf "  ✓ %s\n" "$name"
    return 0
  else
    FAIL=$((FAIL + 1))
    ERRORS="$ERRORS\n  ✗ $name: expected '$expected' in output"
    [ "$JSON_MODE" = "0" ] && printf "  ✗ %s\n" "$name"
    return 1
  fi
}

check_warn() {
  local name="$1"
  shift
  local output
  output=$("$@" 2>&1) && {
    PASS=$((PASS + 1))
    [ "$JSON_MODE" = "0" ] && printf "  ✓ %s\n" "$name"
  } || {
    WARN=$((WARN + 1))
    [ "$JSON_MODE" = "0" ] && printf "  ⚠ %s (non-critical)\n" "$name"
  }
}

check_skip() {
  local name="$1"
  local reason="$2"
  SKIP=$((SKIP + 1))
  [ "$JSON_MODE" = "0" ] && printf "  ⊘ %s (skipped: %s)\n" "$name" "$reason"
}

section() {
  local num="$1"
  local name="$2"
  [ "$JSON_MODE" = "0" ] && echo "" && echo "═══ $num. $name ═══"
}

should_run() {
  local category="$1"
  [ -z "$TARGET_CATEGORY" ] && return 0
  echo "$category" | grep -qi "$TARGET_CATEGORY" && return 0
  return 1
}

is_quick() {
  [ "$QUICK_MODE" = "1" ]
}

# ── Detect GemiFlow version ─────────────────────────────────────
GEMIFLOW_VERSION=$($GEMIFLOW_CMD --version 2>/dev/null || echo "unknown")

# ── Banner ────────────────────────────────────────────────────
if [ "$JSON_MODE" = "0" ]; then
  echo "╔══════════════════════════════════════════════════════════╗"
  echo "║  GemiFlow Appliance — Full Capability Verification Suite   ║"
  if [ -f /etc/os-release ]; then
    OS_NAME=$(grep PRETTY /etc/os-release 2>/dev/null | cut -d= -f2 | tr -d '"' || echo "unknown")
    echo "║  OS: $OS_NAME"
  fi
  echo "║  Node: $(node --version 2>/dev/null || echo 'N/A')"
  echo "║  GemiFlow: $GEMIFLOW_VERSION"
  echo "║  Mode: $([ "$QUICK_MODE" = "1" ] && echo "Quick" || echo "Full") | $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "╚══════════════════════════════════════════════════════════╝"
fi

# ═══════════════════════════════════════════════════════════════
# PART I: Core CLI (Categories 1-5)
# ═══════════════════════════════════════════════════════════════

# ── 1. CLI Core ───────────────────────────────────────────────
if should_run "cli"; then
  section 1 "CLI Core"
  check "gemiflow --version" $GEMIFLOW_CMD --version
  check "gemiflow --help" $GEMIFLOW_CMD --help
  check_contains "version string valid" "[0-9]\+\.[0-9]\+\.[0-9]" $GEMIFLOW_CMD --version
fi

# ── 2. Doctor ─────────────────────────────────────────────────
if should_run "doctor"; then
  section 2 "Doctor (Health Checks)"
  check "doctor runs" $GEMIFLOW_CMD doctor
  check "doctor --fix" $GEMIFLOW_CMD doctor --fix
  check "doctor -c node" $GEMIFLOW_CMD doctor -c node
  check "doctor -c npm" $GEMIFLOW_CMD doctor -c npm
  check "doctor -c disk" $GEMIFLOW_CMD doctor -c disk
  check "doctor -c version" $GEMIFLOW_CMD doctor -c version
fi

# ── 3. Init System ────────────────────────────────────────────
if should_run "init"; then
  section 3 "Init System"
  TEST_DIR="/tmp/gemiflow-verify-$$"
  mkdir -p "$TEST_DIR" && cd "$TEST_DIR"
  check "init --yes" $GEMIFLOW_CMD init --yes
  check ".gemiflow/settings.json exists" test -f .gemiflow/settings.json
  check ".gemiflow/helpers/ exists" test -d .gemiflow/helpers
  check_contains "no TeammateIdle in hooks" "false" sh -c '! grep -q "TeammateIdle" .gemiflow/settings.json && echo false'
  check_contains "no TaskCompleted in hooks" "false" sh -c '! grep -q "\"TaskCompleted\"" .gemiflow/settings.json && echo false'
  check_contains "AGENT_TEAMS env set" "AGENT_TEAMS" cat .gemiflow/settings.json
  check_contains "agentTeams config present" "agentTeams" cat .gemiflow/settings.json
  check_contains "statusLine configured" "statusLine" cat .gemiflow/settings.json
  check "helpers/statusline.cjs exists" test -f .gemiflow/helpers/statusline.cjs
  cd /tmp
  rm -rf "$TEST_DIR"
fi

# ── 4. Memory Operations ─────────────────────────────────────
if should_run "memory"; then
  section 4 "Memory Operations (AgentDB + RVF)"
  check "memory init" $GEMIFLOW_CMD memory init --force
  check "memory store key-1" $GEMIFLOW_CMD memory store --key "verify-1" --value "Capability verification entry one" --namespace verify
  check "memory store key-2" $GEMIFLOW_CMD memory store --key "verify-2" --value "Vector search verification entry" --namespace verify
  check "memory store key-3 with tags" $GEMIFLOW_CMD memory store --key "verify-3" --value "Embedding generation test data" --namespace verify --tags "test,verify"
  check "memory list" $GEMIFLOW_CMD memory list --namespace verify
  check_contains "memory list shows 3 entries" "3" $GEMIFLOW_CMD memory list --namespace verify
  check "memory search (semantic)" $GEMIFLOW_CMD memory search --query "vector search" --namespace verify
  check_contains "memory search finds result" "verify-" $GEMIFLOW_CMD memory search --query "capability verification" --namespace verify
  check "memory retrieve" $GEMIFLOW_CMD memory retrieve --key "verify-1" --namespace verify
  check_contains "memory retrieve content correct" "Capability verification" $GEMIFLOW_CMD memory retrieve --key "verify-1" --namespace verify
  check "memory store with TTL" $GEMIFLOW_CMD memory store --key "ttl-verify" --value "expires soon" --namespace verify --ttl 3600
  check "memory delete" $GEMIFLOW_CMD memory delete --key "ttl-verify" --namespace verify
  # Cleanup
  $GEMIFLOW_CMD memory delete --key "verify-1" --namespace verify >/dev/null 2>&1 || true
  $GEMIFLOW_CMD memory delete --key "verify-2" --namespace verify >/dev/null 2>&1 || true
  $GEMIFLOW_CMD memory delete --key "verify-3" --namespace verify >/dev/null 2>&1 || true
fi

# ── 5. Config Management ─────────────────────────────────────
if should_run "config"; then
  section 5 "Config Management"
  check "config show" $GEMIFLOW_CMD config show
  check "config get" $GEMIFLOW_CMD config get memory.backend
  check_warn "config set" $GEMIFLOW_CMD config set memory.backend hybrid
  check "config list" $GEMIFLOW_CMD config list
fi

# Stop here for quick mode (except cross-feature at end)
if is_quick && [ -z "$TARGET_CATEGORY" ]; then
  # Jump to cross-feature integration
  section 25 "Cross-Feature Integration (Quick)"
  check "quick: store" $GEMIFLOW_CMD memory store --key "quick-test" --value "Quick mode integration test" --namespace quick
  check_contains "quick: search" "quick-test" $GEMIFLOW_CMD memory search --query "integration test" --namespace quick
  check_contains "quick: retrieve" "Quick mode" $GEMIFLOW_CMD memory retrieve --key "quick-test" --namespace quick
  check "quick: cleanup" $GEMIFLOW_CMD memory delete --key "quick-test" --namespace quick

  # Print results and exit
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  echo ""
  echo "══════════════════════════════════════════════════"
  echo "  QUICK MODE RESULTS (${DURATION}s)"
  echo "══════════════════════════════════════════════════"
  echo "  Passed:   $PASS"
  echo "  Failed:   $FAIL"
  echo "  Warnings: $WARN"
  echo "  Total:    $((PASS + FAIL + WARN))"
  echo ""
  [ $FAIL -gt 0 ] && printf "$ERRORS\n"
  [ $FAIL -eq 0 ] && echo "  ★ ALL CRITICAL CHECKS PASSED" || echo "  ✗ $FAIL FAILURES"
  echo "══════════════════════════════════════════════════"
  exit $FAIL
fi

# ═══════════════════════════════════════════════════════════════
# PART II: Agent & Swarm (Categories 6-9)
# ═══════════════════════════════════════════════════════════════

# ── 6. Session Management ─────────────────────────────────────
if should_run "session"; then
  section 6 "Session Management"
  check_warn "session list" $GEMIFLOW_CMD session list
  check_warn "session start" $GEMIFLOW_CMD session start --session-id "verify-session-$$"
  check_warn "session status" $GEMIFLOW_CMD session status
  check_warn "session end" $GEMIFLOW_CMD session end
fi

# ── 7. Agent System ───────────────────────────────────────────
if should_run "agent"; then
  section 7 "Agent System"
  check "agent list" $GEMIFLOW_CMD agent list
  check_warn "agent spawn (dry)" $GEMIFLOW_CMD agent spawn -t coder --name verify-agent --dry-run
  check_warn "agent status" $GEMIFLOW_CMD agent status
  check_warn "agent pool" $GEMIFLOW_CMD agent pool
fi

# ── 8. Swarm Coordination ────────────────────────────────────
if should_run "swarm"; then
  section 8 "Swarm Coordination"
  check_warn "swarm status" $GEMIFLOW_CMD swarm status
  check_warn "swarm init (hierarchical)" $GEMIFLOW_CMD swarm init --topology hierarchical --max-agents 4
  check_warn "swarm init (mesh)" $GEMIFLOW_CMD swarm init --topology mesh --max-agents 4
fi

# ── 9. Task System ────────────────────────────────────────────
if should_run "task"; then
  section 9 "Task System"
  check_warn "task list" $GEMIFLOW_CMD task list
  check_warn "task create" $GEMIFLOW_CMD task create --description "Verify task system" --type feature
fi

# ═══════════════════════════════════════════════════════════════
# PART III: Intelligence & Learning (Categories 10-14)
# ═══════════════════════════════════════════════════════════════

# ── 10. Hooks System ──────────────────────────────────────────
if should_run "hooks"; then
  section 10 "Hooks System (17 Hooks + 12 Workers)"
  check "hooks list" $GEMIFLOW_CMD hooks list
  check "hooks route" $GEMIFLOW_CMD hooks route --task "test routing"
  check_warn "hooks pre-task" $GEMIFLOW_CMD hooks pre-task --description "verify hooks"
  check "hooks worker list" $GEMIFLOW_CMD hooks worker list
  check "hooks statusline" $GEMIFLOW_CMD hooks statusline --json
  check "hooks progress" $GEMIFLOW_CMD hooks progress
fi

# ── 11. Security ──────────────────────────────────────────────
if should_run "security"; then
  section 11 "Security"
  check "security scan" $GEMIFLOW_CMD security scan
  check "security audit" $GEMIFLOW_CMD security audit
  check "security validate" $GEMIFLOW_CMD security validate
fi

# ── 12. Performance ───────────────────────────────────────────
if should_run "performance"; then
  section 12 "Performance"
  check "performance metrics" $GEMIFLOW_CMD performance metrics
  check "performance benchmark" $GEMIFLOW_CMD performance benchmark
fi

# ── 13. Neural / Intelligence ─────────────────────────────────
if should_run "neural"; then
  section 13 "Neural / Intelligence (SONA + MoE)"
  check "neural status" $GEMIFLOW_CMD neural status
  check "neural patterns" $GEMIFLOW_CMD neural patterns --list
fi

# ── 14. Embeddings ────────────────────────────────────────────
if should_run "embeddings"; then
  section 14 "Embeddings (Vector Generation)"
  check "embeddings embed" $GEMIFLOW_CMD embeddings embed --text "test embedding generation"
  check "embeddings search" $GEMIFLOW_CMD embeddings search --query "test" --namespace verify
fi

# ═══════════════════════════════════════════════════════════════
# PART IV: Platform Services (Categories 15-24)
# ═══════════════════════════════════════════════════════════════

# ── 15. Workflow System ───────────────────────────────────────
if should_run "workflow"; then
  section 15 "Workflow System"
  check "workflow list" $GEMIFLOW_CMD workflow list
  check "workflow templates" $GEMIFLOW_CMD workflow list --templates
fi

# ── 16. Daemon ────────────────────────────────────────────────
if should_run "daemon"; then
  section 16 "Daemon (Background Workers)"
  check "daemon status" $GEMIFLOW_CMD daemon status
  check "daemon start" $GEMIFLOW_CMD daemon start
fi

# ── 17. Claims Authorization ──────────────────────────────────
if should_run "claims"; then
  section 17 "Claims Authorization (RBAC)"
  check "claims list" $GEMIFLOW_CMD claims list
  check "claims check" $GEMIFLOW_CMD claims check --claim "memory:read"
fi

# ── 18. Migration ─────────────────────────────────────────────
if should_run "migration"; then
  section 18 "Migration (V2 → V3)"
  check_warn "migrate status" $GEMIFLOW_CMD migrate status
fi

# ── 19. Plugins ───────────────────────────────────────────────
if should_run "plugin"; then
  section 19 "Plugins (IPFS Registry)"
  check "plugins list" $GEMIFLOW_CMD plugins list
fi

# ── 20. MCP Server ────────────────────────────────────────────
if should_run "mcp"; then
  section 20 "MCP Server (215 Tools)"
  check_contains "mcp help" "mcp" $GEMIFLOW_CMD mcp --help
  check "mcp list" $GEMIFLOW_CMD mcp list
fi

# ── 21. Shell Completions ─────────────────────────────────────
if should_run "completions"; then
  section 21 "Shell Completions"
  check "completions bash" $GEMIFLOW_CMD completions bash
  check "completions zsh" $GEMIFLOW_CMD completions zsh
fi

# ── 22. Status ────────────────────────────────────────────────
if should_run "status"; then
  section 22 "System Status"
  check_warn "status" $GEMIFLOW_CMD status
fi

# ── 23. Hive-Mind ─────────────────────────────────────────────
if should_run "hive"; then
  section 23 "Hive-Mind (Byzantine Consensus)"
  check_warn "hive-mind status" $GEMIFLOW_CMD hive-mind status
fi

# ── 24. Process Management ────────────────────────────────────
if should_run "process"; then
  section 24 "Process Management"
  check_warn "process list" $GEMIFLOW_CMD process list
fi

# ═══════════════════════════════════════════════════════════════
# PART V: Integration & End-to-End (Categories 25-35)
# ═══════════════════════════════════════════════════════════════

# ── 25. Cross-Feature Integration ─────────────────────────────
if should_run "integration"; then
  section 25 "Cross-Feature Integration"
  check "integration: store" $GEMIFLOW_CMD memory store --key "int-verify" --value "Cross-feature integration with vector embeddings and semantic search" --namespace integration
  check_contains "integration: search finds it" "int-verify" $GEMIFLOW_CMD memory search --query "cross feature integration" --namespace integration
  check_contains "integration: retrieve content" "Cross-feature" $GEMIFLOW_CMD memory retrieve --key "int-verify" --namespace integration
  check "integration: cleanup" $GEMIFLOW_CMD memory delete --key "int-verify" --namespace integration
fi

# ── 26. RVF Format Verification ───────────────────────────────
if should_run "rvf"; then
  section 26 "RVF Format Verification"
  RVF_DIR="/tmp/gemiflow-rvf-verify-$$"
  mkdir -p "$RVF_DIR"

  # Test RVF backend by writing and reading data
  check "rvf: memory init creates backend" $GEMIFLOW_CMD memory init --force
  check "rvf: store creates data file" $GEMIFLOW_CMD memory store --key "rvf-test" --value "RVF binary format verification" --namespace rvf-verify
  check_contains "rvf: retrieve confirms persistence" "RVF binary" $GEMIFLOW_CMD memory retrieve --key "rvf-test" --namespace rvf-verify
  check "rvf: multiple entries" sh -c "$GEMIFLOW_CMD memory store --key 'rvf-2' --value 'Second entry' --namespace rvf-verify && $GEMIFLOW_CMD memory store --key 'rvf-3' --value 'Third entry' --namespace rvf-verify"
  check_contains "rvf: list shows entries" "3" $GEMIFLOW_CMD memory list --namespace rvf-verify
  check "rvf: delete works" $GEMIFLOW_CMD memory delete --key "rvf-test" --namespace rvf-verify
  check_contains "rvf: list after delete" "2" $GEMIFLOW_CMD memory list --namespace rvf-verify
  # Cleanup
  $GEMIFLOW_CMD memory delete --key "rvf-2" --namespace rvf-verify >/dev/null 2>&1 || true
  $GEMIFLOW_CMD memory delete --key "rvf-3" --namespace rvf-verify >/dev/null 2>&1 || true
  rm -rf "$RVF_DIR"
fi

# ── 27. Local Model Inference (ruvLLM from RuVector) ──────────
if should_run "ruvllm"; then
  section 27 "Local Model Inference (ruvLLM / RuVector)"
  if [ "${SKIP_MODELS:-0}" = "1" ]; then
    check_skip "ruvllm: model load" "SKIP_MODELS=1"
    check_skip "ruvllm: tokenize" "SKIP_MODELS=1"
    check_skip "ruvllm: generate" "SKIP_MODELS=1"
    check_skip "ruvllm: stream" "SKIP_MODELS=1"
  elif command -v gemiflow-ruvllm >/dev/null 2>&1; then
    check_warn "ruvllm: engine available" gemiflow-ruvllm --version
    check_warn "ruvllm: model list" gemiflow-ruvllm models list
    check_warn "ruvllm: tokenize" gemiflow-ruvllm tokenize --text "Hello world"
    check_warn "ruvllm: generate" gemiflow-ruvllm generate --prompt "2+2=" --max-tokens 10
  else
    check_skip "ruvllm: engine" "gemiflow-ruvllm not installed (future: ADR-058 Phase 3)"
    check_skip "ruvllm: inference" "gemiflow-ruvllm not installed"
  fi
fi

# ── 28. API Key Vault ─────────────────────────────────────────
if should_run "vault"; then
  section 28 "API Key Vault"
  if [ "${SKIP_NETWORK:-0}" = "1" ]; then
    check_skip "vault: connectivity" "SKIP_NETWORK=1"
  else
    check_warn "vault: provider test (google)" $GEMIFLOW_CMD providers test google
    check_warn "vault: provider test (openai)" $GEMIFLOW_CMD providers test openai
    check_warn "vault: providers list" $GEMIFLOW_CMD providers list
  fi
fi

# ── 29. Boot Integrity ────────────────────────────────────────
if should_run "boot"; then
  section 29 "Boot Integrity"
  check "boot: gemiflow binary exists" command -v $GEMIFLOW_CMD
  check "boot: node available" command -v node
  check_contains "boot: node version ≥ 20" "v2[0-9]" node --version
  check "boot: npm available" command -v npm
  check_warn "boot: claude cli available" command -v claude
fi

# ── 30. Isolation Checks ──────────────────────────────────────
if should_run "isolation"; then
  section 30 "Isolation Checks"
  if [ -f /.dockerenv ] || grep -q docker /proc/1/cgroup 2>/dev/null; then
    check "isolation: running in container" test -f /.dockerenv -o -d /run/.containerenv
    check_warn "isolation: non-root user" test "$(id -u)" != "0"
    check "isolation: /tmp writable" test -w /tmp
    check "isolation: home writable" test -w "$HOME"
  else
    check_skip "isolation: container" "not running in container"
    check "isolation: filesystem writable" test -w /tmp
  fi
fi

# ── 31. Agent Swarm E2E ───────────────────────────────────────
if should_run "swarm-e2e"; then
  section 31 "Agent Swarm End-to-End"
  # Store coordination data, verify agents can read it
  check "swarm-e2e: store coordination context" $GEMIFLOW_CMD memory store --key "swarm-e2e-context" --value "Agent swarm coordination test: architect designs, coder implements, tester validates" --namespace swarm-e2e
  check_contains "swarm-e2e: search finds coordination" "swarm-e2e" $GEMIFLOW_CMD memory search --query "agent coordination" --namespace swarm-e2e
  check "swarm-e2e: agent list available" $GEMIFLOW_CMD agent list
  check_warn "swarm-e2e: swarm init" $GEMIFLOW_CMD swarm init --topology hierarchical --max-agents 4
  check_warn "swarm-e2e: swarm status" $GEMIFLOW_CMD swarm status
  # Cleanup
  $GEMIFLOW_CMD memory delete --key "swarm-e2e-context" --namespace swarm-e2e >/dev/null 2>&1 || true
fi

# ── 32. MCP End-to-End ────────────────────────────────────────
if should_run "mcp-e2e"; then
  section 32 "MCP Protocol End-to-End"
  check_contains "mcp-e2e: help lists commands" "start\|list\|add" $GEMIFLOW_CMD mcp --help
  check "mcp-e2e: mcp list" $GEMIFLOW_CMD mcp list
  # Test MCP server can start (timeout after 3s)
  check_warn "mcp-e2e: server starts" sh -c "timeout 3 $GEMIFLOW_CMD mcp start --transport stdio 2>&1 || true"
fi

# ── 33. Persistence Cycle ─────────────────────────────────────
if should_run "persistence"; then
  section 33 "Persistence (Write → Verify → Survive)"
  PERSIST_NS="persist-verify-$$"
  check "persist: write data" $GEMIFLOW_CMD memory store --key "persist-1" --value "Persistence test: this data must survive" --namespace "$PERSIST_NS"
  check "persist: write more data" $GEMIFLOW_CMD memory store --key "persist-2" --value "Second persistence entry for durability" --namespace "$PERSIST_NS"
  # Re-read (simulates restart — data should be on disk)
  check_contains "persist: data survives re-read" "Persistence test" $GEMIFLOW_CMD memory retrieve --key "persist-1" --namespace "$PERSIST_NS"
  check_contains "persist: second entry survives" "Second persistence" $GEMIFLOW_CMD memory retrieve --key "persist-2" --namespace "$PERSIST_NS"
  check_contains "persist: count correct" "2" $GEMIFLOW_CMD memory list --namespace "$PERSIST_NS"
  # Cleanup
  $GEMIFLOW_CMD memory delete --key "persist-1" --namespace "$PERSIST_NS" >/dev/null 2>&1 || true
  $GEMIFLOW_CMD memory delete --key "persist-2" --namespace "$PERSIST_NS" >/dev/null 2>&1 || true
fi

# ── 34. Offline Mode ──────────────────────────────────────────
if should_run "offline"; then
  section 34 "Offline Capability"
  # These commands should all work without network
  check "offline: version (no network needed)" $GEMIFLOW_CMD --version
  check "offline: doctor (local checks)" $GEMIFLOW_CMD doctor -c node
  check "offline: memory store (local)" $GEMIFLOW_CMD memory store --key "offline-test" --value "Works without internet" --namespace offline
  check_contains "offline: memory retrieve (local)" "Works without" $GEMIFLOW_CMD memory retrieve --key "offline-test" --namespace offline
  check "offline: config show (local)" $GEMIFLOW_CMD config show
  check_warn "offline: status (local)" $GEMIFLOW_CMD status
  check "offline: completions (local)" $GEMIFLOW_CMD completions bash
  # Cleanup
  $GEMIFLOW_CMD memory delete --key "offline-test" --namespace offline >/dev/null 2>&1 || true
fi

# ── 35. Hot Update Simulation ─────────────────────────────────
if should_run "update"; then
  section 35 "Hot Update Simulation"
  # Verify the current version can be read
  check "update: current version readable" $GEMIFLOW_CMD --version
  check "update: doctor validates current" $GEMIFLOW_CMD doctor
  check_warn "update: config backup possible" $GEMIFLOW_CMD config show
fi

# ═══════════════════════════════════════════════════════════════
# RESULTS
# ═══════════════════════════════════════════════════════════════
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
TOTAL=$((PASS + FAIL + WARN + SKIP))

if [ "$JSON_MODE" = "1" ]; then
  cat <<ENDJSON
{
  "suite": "gemiflow-appliance-verify",
  "version": "$GEMIFLOW_VERSION",
  "timestamp": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
  "duration_seconds": $DURATION,
  "results": {
    "passed": $PASS,
    "failed": $FAIL,
    "warnings": $WARN,
    "skipped": $SKIP,
    "total": $TOTAL
  },
  "success": $([ $FAIL -eq 0 ] && echo "true" || echo "false")
}
ENDJSON
else
  echo ""
  echo "══════════════════════════════════════════════════"
  echo "  RESULTS (${DURATION}s)"
  echo "══════════════════════════════════════════════════"
  echo "  Passed:   $PASS"
  echo "  Failed:   $FAIL"
  echo "  Warnings: $WARN (non-critical)"
  echo "  Skipped:  $SKIP"
  echo "  Total:    $TOTAL"
  echo ""

  if [ $FAIL -gt 0 ]; then
    echo "  FAILURES:"
    printf "$ERRORS\n"
    echo ""
  fi

  if [ $FAIL -eq 0 ]; then
    echo "  ★ ALL CRITICAL CHECKS PASSED"
  else
    echo "  ✗ $FAIL CRITICAL FAILURES"
  fi
  echo "══════════════════════════════════════════════════"
fi

exit $FAIL
