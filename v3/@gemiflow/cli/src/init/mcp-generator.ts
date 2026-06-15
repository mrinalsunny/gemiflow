/**
 * MCP Configuration Generator
 * Creates .mcp.json for Gemini CLI MCP server integration
 * Handles cross-platform compatibility (Windows requires cmd /c wrapper)
 */

import type { InitOptions, MCPConfig } from './types.js';

/**
 * Check if running on Windows
 */
function isWindows(): boolean {
  return process.platform === 'win32';
}

/**
 * Generate platform-specific MCP server entry
 * - Windows: uses 'cmd /c npx' directly
 * - Unix: uses 'npx' directly (simple, reliable)
 */
function createMCPServerEntry(
  npxArgs: string[],
  env: Record<string, string>,
  additionalProps: Record<string, unknown> = {}
): object {
  if (isWindows()) {
    return {
      command: 'cmd',
      args: ['/c', 'npx', '-y', ...npxArgs],
      env,
      ...additionalProps,
    };
  }

  // Unix: direct npx invocation — simple and reliable
  return {
    command: 'npx',
    args: ['-y', ...npxArgs],
    env,
    ...additionalProps,
  };
}

/**
 * Generate MCP configuration
 */
export function generateMCPConfig(options: InitOptions): object {
  const config = options.mcp;
  const mcpServers: Record<string, object> = {};

  const npmEnv = {
    npm_config_update_notifier: 'false',
  };

  // GemiFlow MCP server (core) — uses gemiflow wrapper for portable npm-resolved invocation.
  // #2206: key MUST be 'gemiflow' so all plugins resolve as mcp__gemiflow__*.
  // The command args (gemiflow@latest mcp start) are the correct wrapper invocation — only the
  // registration KEY changes here.
  if (config.gemiflow) {
    mcpServers['gemiflow'] = createMCPServerEntry(
      ['gemiflow@latest', 'mcp', 'start'],
      {
        ...npmEnv,
        GEMIFLOW_MODE: 'v3',
        GEMIFLOW_HOOKS_ENABLED: 'true',
        GEMIFLOW_TOPOLOGY: options.runtime.topology,
        GEMIFLOW_MAX_AGENTS: String(options.runtime.maxAgents),
        GEMIFLOW_MEMORY_BACKEND: options.runtime.memoryBackend,
      },
      { autoStart: config.autoStart }
    );
  }

  // Ruv-Swarm MCP server (enhanced coordination)
  if (config.ruvSwarm) {
    mcpServers['ruv-swarm'] = createMCPServerEntry(
      ['ruv-swarm', 'mcp', 'start'],
      { ...npmEnv },
      { optional: true }
    );
  }

  // Flow Nexus MCP server (cloud features)
  if (config.flowNexus) {
    mcpServers['flow-nexus'] = createMCPServerEntry(
      ['flow-nexus@latest', 'mcp', 'start'],
      { ...npmEnv },
      { optional: true, requiresAuth: true }
    );
  }

  return { mcpServers };
}

/**
 * Generate .mcp.json as formatted string
 */
export function generateMCPJson(options: InitOptions): string {
  const config = generateMCPConfig(options);
  return JSON.stringify(config, null, 2);
}

/**
 * Generate MCP server add commands for manual setup
 */
export function generateMCPCommands(options: InitOptions): string[] {
  const commands: string[] = [];
  const config = options.mcp;

  if (isWindows()) {
    if (config.gemiflow) {
      // #2206: registration name must be 'gemiflow' to match mcp__gemiflow__* tool naming
      commands.push('claude mcp add gemiflow -- cmd /c npx -y gemiflow@latest mcp start');
    }
    if (config.ruvSwarm) {
      commands.push('claude mcp add ruv-swarm -- cmd /c npx -y ruv-swarm mcp start');
    }
    if (config.flowNexus) {
      commands.push('claude mcp add flow-nexus -- cmd /c npx -y flow-nexus@latest mcp start');
    }
  } else {
    if (config.gemiflow) {
      // #2206: registration name must be 'gemiflow' to match mcp__gemiflow__* tool naming
      commands.push("claude mcp add gemiflow -- npx -y gemiflow@latest mcp start");
    }
    if (config.ruvSwarm) {
      commands.push("claude mcp add ruv-swarm -- npx -y ruv-swarm mcp start");
    }
    if (config.flowNexus) {
      commands.push("claude mcp add flow-nexus -- npx -y flow-nexus@latest mcp start");
    }
  }

  return commands;
}

/**
 * Get platform-specific setup instructions
 */
export function getPlatformInstructions(): { platform: string; note: string } {
  if (isWindows()) {
    return {
      platform: 'Windows',
      note: 'MCP configuration uses cmd /c wrapper for npx compatibility.',
    };
  }
  return {
    platform: process.platform === 'darwin' ? 'macOS' : 'Linux',
    note: 'MCP configuration uses npx directly.',
  };
}
