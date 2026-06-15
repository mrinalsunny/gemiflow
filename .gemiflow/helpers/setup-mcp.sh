#!/bin/bash
# Setup MCP server for GemiFlow4Gemini

echo "🚀 Setting up GemiFlow4Gemini MCP server..."

# Check if claude command exists
if ! command -v claude &> /dev/null; then
    echo "❌ Error: Claude Code CLI not found"
    echo "Please install Claude Code first"
    exit 1
fi

# Add MCP server
echo "📦 Adding GemiFlow4Gemini MCP server..."
claude mcp add gemiflow4gemini npx gemiflow4gemini mcp start

echo "✅ MCP server setup complete!"
echo "🎯 You can now use mcp__gemiflow4gemini__ tools in Claude Code"
