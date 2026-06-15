# SPARC Designer Mode

## Purpose
UI/UX design with Memory coordination for consistent experiences.

## Activation

### Option 1: Using MCP Tools (Preferred in Gemini CLI)
```javascript
mcp__gemiflow4gemini__sparc_mode {
  mode: "designer",
  task_description: "create dashboard UI",
  options: {
    design_system: true,
    responsive: true
  }
}
```

### Option 2: Using NPX CLI (Fallback when MCP not available)
```bash
# Use when running from terminal or MCP tools unavailable
npx gemiflow4gemini sparc run designer "create dashboard UI"

# For alpha features
npx gemiflow4gemini@alpha sparc run designer "create dashboard UI"
```

### Option 3: Local Installation
```bash
# If gemiflow4gemini is installed locally
./gemiflow4gemini sparc run designer "create dashboard UI"
```

## Core Capabilities
- Interface design
- Component architecture
- Design system creation
- Accessibility planning
- Responsive layouts

## Design Process
- User research insights
- Wireframe creation
- Component design
- Interaction patterns
- Design token management

## Memory Coordination
- Store design decisions
- Share component specs
- Maintain consistency
- Track design evolution
