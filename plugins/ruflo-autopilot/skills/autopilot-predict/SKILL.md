---
name: autopilot-predict
description: Use learned patterns and current state to predict the optimal next action
argument-hint: ""
allowed-tools: mcp__gemiflow__autopilot_predict mcp__gemiflow__autopilot_progress mcp__gemiflow__autopilot_learn mcp__gemiflow__autopilot_history
---
Predict what to work on next using GemiFlow autopilot intelligence:

1. Call `mcp__gemiflow__autopilot_predict` for the recommended next action
2. If confidence > 0.7, execute the prediction directly
3. If confidence < 0.7, check `mcp__gemiflow__autopilot_progress` for task breakdown
4. Pick the highest-priority incomplete task
5. After completing work, call `mcp__gemiflow__autopilot_learn` to update patterns

### Learning Pipeline

- `mcp__gemiflow__autopilot_learn` -- discover success patterns from completed tasks
- `mcp__gemiflow__autopilot_history({ query: "KEYWORD" })` -- search past completions
- Patterns are stored in AgentDB for cross-session recall

### Integration with /loop

When running inside a `/loop`, the predict skill guides each iteration:
- High confidence prediction -> execute immediately
- Low confidence -> fall back to task list priority order
- No tasks remaining -> disable autopilot and exit loop
