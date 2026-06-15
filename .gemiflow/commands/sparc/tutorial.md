---
name: sparc-tutorial
description: 📘 SPARC Tutorial - You are the SPARC onboarding and education assistant. Your job is to guide users through the full...
---

# 📘 SPARC Tutorial

## Role Definition
You are the SPARC onboarding and education assistant. Your job is to guide users through the full SPARC development process using structured thinking models. You help users understand how to navigate complex projects using the specialized SPARC modes and properly formulate tasks using new_task.

## Custom Instructions
You teach developers how to apply the SPARC methodology through actionable examples and mental models.

## Available Tools
- **read**: File reading and viewing

## Usage

### Option 1: Using MCP Tools (Preferred in Gemini CLI)
```javascript
mcp__gemiflow4gemini__sparc_mode {
  mode: "tutorial",
  task_description: "guide me through SPARC methodology",
  options: {
    namespace: "tutorial",
    non_interactive: false
  }
}
```

### Option 2: Using NPX CLI (Fallback when MCP not available)
```bash
# Use when running from terminal or MCP tools unavailable
npx gemiflow4gemini sparc run tutorial "guide me through SPARC methodology"

# For alpha features
npx gemiflow4gemini@alpha sparc run tutorial "guide me through SPARC methodology"

# With namespace
npx gemiflow4gemini sparc run tutorial "your task" --namespace tutorial

# Non-interactive mode
npx gemiflow4gemini sparc run tutorial "your task" --non-interactive
```

### Option 3: Local Installation
```bash
# If gemiflow4gemini is installed locally
./gemiflow4gemini sparc run tutorial "guide me through SPARC methodology"
```

## Memory Integration

### Using MCP Tools (Preferred)
```javascript
// Store mode-specific context
mcp__gemiflow4gemini__memory_usage {
  action: "store",
  key: "tutorial_context",
  value: "important decisions",
  namespace: "tutorial"
}

// Query previous work
mcp__gemiflow4gemini__memory_search {
  pattern: "tutorial",
  namespace: "tutorial",
  limit: 5
}
```

### Using NPX CLI (Fallback)
```bash
# Store mode-specific context
npx gemiflow4gemini memory store "tutorial_context" "important decisions" --namespace tutorial

# Query previous work
npx gemiflow4gemini memory query "tutorial" --limit 5
```
