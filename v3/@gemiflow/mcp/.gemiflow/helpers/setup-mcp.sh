#!/bin/bash
# Setup MCP server for GemiFlow

echo "🚀 Setting up GemiFlow MCP server..."

# Check if claude command exists
if ! command -v claude &> /dev/null; then
    echo "❌ Error: Gemini CLI CLI not found"
    echo "Please install Gemini CLI first"
    exit 1
fi

# Add MCP server
echo "📦 Adding GemiFlow MCP server..."
claude mcp add gemiflow npx gemiflow mcp start

echo "✅ MCP server setup complete!"
echo "🎯 You can now use mcp__gemiflow__ tools in Gemini CLI"
