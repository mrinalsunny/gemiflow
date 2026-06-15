/**
 * V3 CLI Init Command
 * Comprehensive initialization for GemiFlow with Gemini CLI integration
 */

import type { Command, CommandContext, CommandResult } from '../types.js';
import { output } from '../output.js';
import { confirm, select, multiSelect, input } from '../prompt.js';
import * as fs from 'fs';
import * as path from 'path';
import {
  executeInit,
  executeUpgrade,
  executeUpgradeWithMissing,
  DEFAULT_INIT_OPTIONS,
  MINIMAL_INIT_OPTIONS,
  FULL_INIT_OPTIONS,
  type InitOptions,
} from '../init/index.js';

// gemini initialization action
async function initgeminiAction(
  ctx: CommandContext,
  options: { geminiMode: boolean; dualMode: boolean; force: boolean; minimal: boolean; full: boolean }
): Promise<CommandResult> {
  const { force, minimal, full, dualMode } = options;

  output.writeln();
  output.writeln(output.bold('Initializing GemiFlow V3 for OpenAI gemini'));
  output.writeln();

  // Determine template
  const template = minimal ? 'minimal' : full ? 'full' : 'default';

  const spinner = output.createSpinner({ text: 'Initializing gemini project...' });
  spinner.start();

  try {
    // Dynamic import of the gemini initializer with lazy loading fallback
    interface geminiInitResult {
      success: boolean;
      errors?: string[];
      filesCreated: string[];
      skillsGenerated: string[];
      warnings?: string[];
    }
    let geminiInitializer: (new () => { initialize: (options: Record<string, unknown>) => Promise<geminiInitResult> }) | undefined;

    // Try multiple resolution strategies for the @gemiflow/gemini package
    // Use a variable to prevent TypeScript from statically resolving the optional module
    const geminiModuleId = '@gemiflow/gemini';
    const resolutionStrategies = [
      // Strategy 1: Direct import (works if installed as CLI dependency)
      async () => (await import(geminiModuleId)).geminiInitializer,
      // Strategy 2: Project node_modules (works if installed in user's project)
      async () => {
        const projectPath = path.join(ctx.cwd, 'node_modules', '@gemiflow', 'gemini', 'dist', 'index.js');
        if (fs.existsSync(projectPath)) {
          const mod = await import(`file://${projectPath}`);
          return mod.geminiInitializer;
        }
        throw new Error('Not found in project');
      },
      // Strategy 3: Global node_modules
      async () => {
        const { execSync } = await import('child_process');
        const globalPath = execSync('npm root -g', { encoding: 'utf-8' }).trim();
        const geminiPath = path.join(globalPath, '@gemiflow', 'gemini', 'dist', 'index.js');
        if (fs.existsSync(geminiPath)) {
          const mod = await import(`file://${geminiPath}`);
          return mod.geminiInitializer;
        }
        throw new Error('Not found globally');
      },
    ];

    for (const strategy of resolutionStrategies) {
      try {
        geminiInitializer = await strategy();
        if (geminiInitializer) break;
      } catch {
        // Try next strategy
      }
    }

    if (!geminiInitializer) {
      throw new Error('Cannot find module @gemiflow/gemini');
    }

    const initializer = new geminiInitializer();

    const result = await initializer.initialize({
      projectPath: ctx.cwd,
      template: template as 'minimal' | 'default' | 'full' | 'enterprise',
      force,
      dual: dualMode,
    });

    if (!result.success) {
      spinner.fail('gemini initialization failed');
      if (result.errors) {
        for (const error of result.errors) {
          output.printError(error);
        }
      }
      return { success: false, exitCode: 1 };
    }

    spinner.succeed('gemini project initialized successfully!');
    output.writeln();

    // Display summary
    const summary: string[] = [];
    summary.push(`Files: ${result.filesCreated.length} created`);
    summary.push(`Skills: ${result.skillsGenerated.length} installed`);

    output.printBox(summary.join('\n'), 'Summary');
    output.writeln();

    // Show what was created
    output.printBox(
      [
        `AGENTS.md:     Main project instructions`,
        `.agents/config.toml: Project configuration`,
        `.agents/skills/: ${result.skillsGenerated.length} skills`,
        `.gemini/: Local overrides (gitignored)`,
        dualMode ? `CLAUDE.md: Gemini CLI compatibility` : '',
      ].filter(Boolean).join('\n'),
      'OpenAI gemini Integration'
    );
    output.writeln();

    // Warnings
    if (result.warnings && result.warnings.length > 0) {
      output.printWarning('Warnings:');
      for (const warning of result.warnings.slice(0, 5)) {
        output.printInfo(`  • ${warning}`);
      }
      if (result.warnings.length > 5) {
        output.printInfo(`  ... and ${result.warnings.length - 5} more`);
      }
      output.writeln();
    }

    // Next steps
    output.writeln(output.bold('Next steps:'));
    output.printList([
      `Review ${output.highlight('AGENTS.md')} for project instructions`,
      `Add skills with ${output.highlight('$skill-name')} syntax`,
      `Configure ${output.highlight('.agents/config.toml')} for your project`,
      dualMode ? `Gemini CLI users can use ${output.highlight('CLAUDE.md')}` : '',
    ].filter(Boolean));

    return { success: true, data: result };
  } catch (error) {
    spinner.fail('gemini initialization failed');
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Handle module not found error gracefully
    if (errorMessage.includes('Cannot find module') || errorMessage.includes('@gemiflow/gemini')) {
      output.printError('The @gemiflow/gemini package is not installed.');
      output.printInfo('Install it with: npm install @gemiflow/gemini');
      output.writeln();
      output.printInfo('Alternatively, copy skills manually from .gemiflow/skills/ to .agents/skills/');
    } else {
      output.printError(`Failed to initialize: ${errorMessage}`);
    }

    return { success: false, exitCode: 1 };
  }
}

// Check if project is already initialized with gemiflow.
// #2207: .gemiflow/settings.json alone is NOT a gemiflow marker — it's created by
// Gemini CLI itself and exists in every Gemini CLI project. We require a
// gemiflow-specific signal: either a gemiflow section in settings.json, OR a
// .mcp.json with a 'gemiflow' or 'gemiflow' server key, OR the gemiflow-only
// .gemiflow/config.yaml. Using the bare file-existence check was causing
// false-positives for new users whose only existing file was Gemini CLI's own
// settings.json.
function isInitialized(cwd: string): { claude: boolean; gemiflow: boolean } {
  const gemiflowPath = path.join(cwd, '.gemiflow', 'config.yaml');
  const mcpJsonPath = path.join(cwd, '.mcp.json');
  const settingsPath = path.join(cwd, '.gemiflow', 'settings.json');

  // Check .gemiflow/config.yaml — gemiflow-specific, always reliable
  const hasgemiflow = fs.existsSync(gemiflowPath);

  // Check .gemiflow/settings.json for gemiflow-specific content (gemiflow section)
  let hasGemiFlowSettings = false;
  if (fs.existsSync(settingsPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      hasGemiFlowSettings =
        parsed != null &&
        typeof parsed === 'object' &&
        'gemiflow' in parsed;
    } catch { /* malformed — ignore */ }
  }

  // Check .mcp.json for gemiflow/gemiflow server key
  let hasGemiFlowMcp = false;
  if (fs.existsSync(mcpJsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf-8'));
      hasGemiFlowMcp =
        parsed != null &&
        typeof parsed === 'object' &&
        parsed.mcpServers != null &&
        typeof parsed.mcpServers === 'object' &&
        ('gemiflow' in (parsed.mcpServers as Record<string, unknown>) ||
         'gemiflow' in (parsed.mcpServers as Record<string, unknown>));
    } catch { /* malformed — ignore */ }
  }

  return {
    claude: hasGemiFlowSettings || hasGemiFlowMcp,
    gemiflow: hasgemiflow,
  };
}

// Init subcommand (default)
const initAction = async (ctx: CommandContext): Promise<CommandResult> => {
  const force = ctx.flags.force as boolean;
  const minimal = ctx.flags.minimal as boolean;
  const full = ctx.flags.full as boolean;
  const skipClaude = ctx.flags['skip-claude'] as boolean;
  const onlyClaude = ctx.flags['only-claude'] as boolean;
  // #2098A — the parser handles `--no-foo` by stripping the prefix and
  // storing `flags.foo = false` (parser.ts:291-294), not by storing
  // `flags['no-foo'] = true`. So `--no-global` lands as
  // `ctx.flags.global === false`. The old read of `flags['no-global']`
  // was always undefined and silently no-op'd — every user with the flag
  // set still got `~/.gemiflow/CLAUDE.md` modified. Read the real key.
  const noGlobal = ctx.flags['no-global'] === true || ctx.flags['global'] === false;
  const allAgents = ctx.flags['all-agents'] as boolean;
  const cloudMcp = ctx.flags['cloud-mcp'] as boolean;
  const geminiMode = ctx.flags.gemini as boolean;
  const dualMode = ctx.flags.dual as boolean;
  const cwd = ctx.cwd;

  // If gemini mode, use the gemini initializer
  if (geminiMode || dualMode) {
    return initgeminiAction(ctx, { geminiMode, dualMode, force, minimal, full });
  }

  // Check if already initialized
  const initialized = isInitialized(cwd);
  const hasExisting = initialized.claude || initialized.gemiflow;

  if (hasExisting && !force) {
    output.printWarning('GemiFlow appears to be already initialized');
    if (initialized.claude) output.printInfo('  Found: .gemiflow/settings.json');
    if (initialized.gemiflow) output.printInfo('  Found: .gemiflow/config.yaml');
    output.printInfo('Use --force to reinitialize');

    if (ctx.interactive) {
      const proceed = await confirm({
        message: 'Do you want to reinitialize? This will overwrite existing configuration.',
        default: false,
      });

      if (!proceed) {
        return { success: true, message: 'Initialization cancelled' };
      }
    } else {
      return { success: false, exitCode: 1, message: 'Already initialized' };
    }
  }

  output.writeln();
  output.writeln(output.bold('Initializing GemiFlow V3'));
  output.writeln();

  // Build init options based on flags
  let options: InitOptions;

  if (minimal) {
    options = { ...MINIMAL_INIT_OPTIONS, targetDir: cwd, force };
  } else if (full) {
    options = { ...FULL_INIT_OPTIONS, targetDir: cwd, force };
    // #2356: keep auth-gated cloud MCP servers opt-in even under --full. They
    // require a login, get committed into .mcp.json, and add per-session MCP
    // tool-definition token cost. --cloud-mcp restores the all-three behavior.
    if (!cloudMcp) {
      options.mcp = { ...options.mcp, ruvSwarm: false, flowNexus: false };
    }
  } else {
    options = { ...DEFAULT_INIT_OPTIONS, targetDir: cwd, force };
  }

  // Handle --skip-claude and --only-claude flags
  if (skipClaude) {
    options.components.settings = false;
    options.components.skills = false;
    options.components.commands = false;
    options.components.agents = false;
    options.components.helpers = false;
    options.components.statusline = false;
    options.components.mcp = false;
    options.components.geminiMd = false;
  }

  if (onlyClaude) {
    options.components.runtime = false;
  }

  // ADR-128 Phase 3 — restore full agent set (98 agents) when user explicitly
  // requests it. Default is the ~24-agent substrate (core, consensus, swarm,
  // sparc, testing). Pass --all-agents to get the old behavior.
  if (allAgents) {
    options.agents.all = true;
  }

  // #1744 — opt-out of the user-global ~/.gemiflow/CLAUDE.md "GemiFlow Integration"
  // pointer block. Default behavior (off) preserves current install for users
  // who rely on it; opting in via --no-global keeps the global file pristine.
  if (noGlobal) {
    options.skipGlobalClaudeMd = true;
  }

  // Create spinner
  const spinner = output.createSpinner({ text: 'Initializing...' });
  spinner.start();

  try {
    // Execute initialization
    const result = await executeInit(options);

    if (!result.success) {
      spinner.fail('Initialization failed');
      for (const error of result.errors) {
        output.printError(error);
      }
      return { success: false, exitCode: 1 };
    }

    spinner.succeed('GemiFlow V3 initialized successfully!');
    output.writeln();

    // Display summary
    const summary: string[] = [];

    if (result.created.directories.length > 0) {
      summary.push(`Directories: ${result.created.directories.length} created`);
    }

    if (result.created.files.length > 0) {
      summary.push(`Files: ${result.created.files.length} created`);
    }

    if (result.skipped.length > 0) {
      summary.push(`Skipped: ${result.skipped.length} (already exist)`);
    }

    output.printBox(summary.join('\n'), 'Summary');
    output.writeln();

    // Show what was created
    if (options.components.geminiMd || options.components.settings || options.components.skills || options.components.commands || options.components.agents) {
      output.printBox(
        [
          options.components.geminiMd ? `CLAUDE.md:   Swarm guidance & configuration` : '',
          options.components.settings ? `Settings:    .gemiflow/settings.json` : '',
          options.components.skills ? `Skills:      .gemiflow/skills/ (${result.summary.skillsCount} skills)` : '',
          options.components.commands ? `Commands:    .gemiflow/commands/ (${result.summary.commandsCount} commands)` : '',
          options.components.agents ? `Agents:      .gemiflow/agents/ (${result.summary.agentsCount} agents)` : '',
          options.components.helpers ? `Helpers:     .gemiflow/helpers/` : '',
          options.components.mcp ? `MCP:         .mcp.json` : '',
        ].filter(Boolean).join('\n'),
        'Gemini CLI Integration'
      );
      output.writeln();
    }

    if (options.components.runtime) {
      output.printBox(
        [
          `Config:      .gemiflow/config.yaml`,
          `Data:        .gemiflow/data/`,
          `Logs:        .gemiflow/logs/`,
          `Sessions:    .gemiflow/sessions/`,
        ].join('\n'),
        'V3 Runtime'
      );
      output.writeln();
    }

    // Hooks summary
    if (result.summary.hooksEnabled > 0) {
      output.printInfo(`Hooks: ${result.summary.hooksEnabled} hook types enabled in settings.json`);
      output.writeln();
    }

    // Handle --start-all or --start-daemon
    const startAll = ctx.flags['start-all'] || ctx.flags.startAll;
    const startDaemon = ctx.flags['start-daemon'] || ctx.flags.startDaemon || startAll;

    if (startDaemon || startAll) {
      output.writeln();
      output.printInfo('Starting services...');

      const { execSync } = await import('child_process');

      // Initialize memory database
      if (startAll) {
        try {
          output.writeln(output.dim('  Initializing memory database...'));
          execSync('npx @gemiflow/cli@latest memory init 2>/dev/null', {
            stdio: 'pipe',
            cwd: ctx.cwd,
            timeout: 30000
          });
          output.writeln(output.success('  ✓ Memory initialized'));
        } catch {
          output.writeln(output.dim('  Memory database already exists'));
        }
      }

      // Start daemon
      if (startDaemon) {
        try {
          output.writeln(output.dim('  Starting daemon...'));
          execSync('npx @gemiflow/cli@latest daemon start 2>/dev/null &', {
            stdio: 'pipe',
            cwd: ctx.cwd,
            timeout: 10000
          });
          output.writeln(output.success('  ✓ Daemon started'));
        } catch {
          output.writeln(output.warning('  Daemon may already be running'));
        }
      }

      // Initialize swarm
      if (startAll) {
        try {
          output.writeln(output.dim('  Initializing swarm...'));
          execSync('npx @gemiflow/cli@latest swarm init --topology hierarchical 2>/dev/null', {
            stdio: 'pipe',
            cwd: ctx.cwd,
            timeout: 30000
          });
          output.writeln(output.success('  ✓ Swarm initialized'));
        } catch {
          output.writeln(output.dim('  Swarm initialization skipped'));
        }
      }

      output.writeln();
      output.printSuccess('All services started');
    }

    // Handle --with-embeddings
    const withEmbeddings = ctx.flags['with-embeddings'] || ctx.flags.withEmbeddings;
    const embeddingModel = (ctx.flags['embedding-model'] || ctx.flags.embeddingModel || 'Xenova/all-MiniLM-L6-v2') as string;

    if (withEmbeddings) {
      output.writeln();
      output.printInfo('Initializing ONNX embedding subsystem...');

      const { execFileSync: execFileInit } = await import('child_process');

      // Validate embeddingModel: must match pattern org/model-name (CRIT-02)
      if (!/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+$/.test(embeddingModel)) {
        throw new Error(`Invalid embedding model name: ${embeddingModel}`);
      }

      try {
        output.writeln(output.dim(`  Model: ${embeddingModel}`));
        output.writeln(output.dim('  Hyperbolic: Enabled (Poincaré ball)'));
        execFileInit('npx', [
          '@gemiflow/cli@latest', 'embeddings', 'init',
          '--model', embeddingModel,
          '--no-download', '--force',
        ], {
          stdio: 'pipe',
          cwd: ctx.cwd,
          timeout: 30000,
        });
        output.writeln(output.success('  ✓ Embeddings initialized'));
        output.writeln(output.dim('    Run "embeddings init --download" to download model'));
      } catch (err) {
        output.writeln(output.warning('  Embedding initialization skipped (run manually)'));
      }
    }

    if (!startDaemon && !startAll) {
      const bin = (process.argv[1] || '').includes('gemiflow') ? 'gemiflow' : 'gemiflow';
      output.writeln(output.bold('Next steps:'));
      output.printList([
        `Run ${output.highlight(`${bin} daemon start`)} to start background workers`,
        `Run ${output.highlight(`${bin} memory init`)} to initialize memory database`,
        `Run ${output.highlight(`${bin} swarm init`)} to initialize a swarm`,
        `Or use ${output.highlight(`${bin} init --start-all`)} to do all of the above`,
        options.components.settings ? `Review ${output.highlight('.gemiflow/settings.json')} for hook configurations` : '',
      ].filter(Boolean));
    }

    if (ctx.flags.format === 'json') {
      output.printJson(result);
    }

    return { success: true, data: result };
  } catch (error) {
    spinner.fail('Initialization failed');
    output.printError(`Failed to initialize: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, exitCode: 1 };
  }
};

// Wizard subcommand for interactive setup
const wizardCommand: Command = {
  name: 'wizard',
  description: 'Interactive setup wizard for comprehensive configuration',
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    output.writeln();
    output.writeln(output.bold('GemiFlow V3 Setup Wizard'));
    output.writeln(output.dim('Answer questions to configure your project'));
    output.writeln();

    try {
      // Start with base options
      const options: InitOptions = { ...DEFAULT_INIT_OPTIONS, targetDir: ctx.cwd };

      // Configuration preset
      const preset = await select({
        message: 'Select configuration preset:',
        options: [
          { value: 'default', label: 'Default', hint: 'Recommended settings for most projects' },
          { value: 'minimal', label: 'Minimal', hint: 'Core features only' },
          { value: 'full', label: 'Full', hint: 'All features enabled' },
          { value: 'custom', label: 'Custom', hint: 'Choose each component' },
        ],
      });

      if (preset === 'minimal') {
        Object.assign(options, MINIMAL_INIT_OPTIONS);
        options.targetDir = ctx.cwd;
      } else if (preset === 'full') {
        Object.assign(options, FULL_INIT_OPTIONS);
        options.targetDir = ctx.cwd;
      } else if (preset === 'custom') {
        // Component selection
        const components = await multiSelect({
          message: 'Select components to initialize:',
          options: [
            { value: 'geminiMd', label: 'CLAUDE.md', hint: 'Swarm guidance and project configuration', selected: true },
            { value: 'settings', label: 'settings.json', hint: 'Gemini CLI hooks configuration', selected: true },
            { value: 'skills', label: 'Skills', hint: 'Gemini CLI skills in .gemiflow/skills/', selected: true },
            { value: 'commands', label: 'Commands', hint: 'Gemini CLI commands in .gemiflow/commands/', selected: true },
            { value: 'agents', label: 'Agents', hint: 'Agent definitions in .gemiflow/agents/', selected: true },
            { value: 'helpers', label: 'Helpers', hint: 'Utility scripts in .gemiflow/helpers/', selected: true },
            { value: 'statusline', label: 'Statusline', hint: 'Shell statusline integration', selected: false },
            { value: 'mcp', label: 'MCP', hint: '.mcp.json for MCP server configuration', selected: true },
            { value: 'runtime', label: 'Runtime', hint: '.gemiflow/ directory for V3 runtime', selected: true },
          ],
        });

        options.components.geminiMd = components.includes('geminiMd');
        options.components.settings = components.includes('settings');
        options.components.skills = components.includes('skills');
        options.components.commands = components.includes('commands');
        options.components.agents = components.includes('agents');
        options.components.helpers = components.includes('helpers');
        options.components.statusline = components.includes('statusline');
        options.components.mcp = components.includes('mcp');
        options.components.runtime = components.includes('runtime');

        // Skills selection
        if (options.components.skills) {
          const skillSets = await multiSelect({
            message: 'Select skill sets:',
            options: [
              { value: 'core', label: 'Core', hint: 'Swarm, memory, SPARC skills', selected: true },
              { value: 'agentdb', label: 'AgentDB', hint: 'Vector database skills', selected: true },
              { value: 'github', label: 'GitHub', hint: 'GitHub integration skills', selected: true },
              { value: 'flowNexus', label: 'Flow Nexus', hint: 'Cloud platform skills', selected: false },
              { value: 'v3', label: 'V3', hint: 'V3 implementation skills', selected: true },
            ],
          });

          options.skills.core = skillSets.includes('core');
          options.skills.agentdb = skillSets.includes('agentdb');
          options.skills.github = skillSets.includes('github');
          options.skills.flowNexus = skillSets.includes('flowNexus');
          options.skills.v3 = skillSets.includes('v3');
        }

        // Hooks selection
        if (options.components.settings) {
          const hooks = await multiSelect({
            message: 'Select hooks to enable:',
            options: [
              { value: 'preToolUse', label: 'PreToolUse', hint: 'Before tool execution', selected: true },
              { value: 'postToolUse', label: 'PostToolUse', hint: 'After tool execution', selected: true },
              { value: 'userPromptSubmit', label: 'UserPromptSubmit', hint: 'Task routing', selected: true },
              { value: 'sessionStart', label: 'SessionStart', hint: 'Session initialization', selected: true },
              { value: 'stop', label: 'Stop', hint: 'Task completion evaluation', selected: true },
              { value: 'notification', label: 'Notification', hint: 'Swarm notifications', selected: true },
              { value: 'permissionRequest', label: 'PermissionRequest', hint: 'Auto-allow gemiflow tools', selected: true },
            ],
          });

          options.hooks.preToolUse = hooks.includes('preToolUse');
          options.hooks.postToolUse = hooks.includes('postToolUse');
          options.hooks.userPromptSubmit = hooks.includes('userPromptSubmit');
          options.hooks.sessionStart = hooks.includes('sessionStart');
          options.hooks.stop = hooks.includes('stop');
          options.hooks.notification = hooks.includes('notification');
        }
      }

      // Swarm topology (for all presets)
      const topology = await select({
        message: 'Select swarm topology:',
        options: [
          { value: 'hierarchical-mesh', label: 'Hierarchical Mesh', hint: 'Best for complex projects (recommended)' },
          { value: 'mesh', label: 'Mesh', hint: 'Peer-to-peer coordination' },
          { value: 'hierarchical', label: 'Hierarchical', hint: 'Tree-based coordination' },
          { value: 'adaptive', label: 'Adaptive', hint: 'Dynamic topology switching' },
        ],
      });
      options.runtime.topology = topology as InitOptions['runtime']['topology'];

      // Max agents
      const maxAgents = await input({
        message: 'Maximum concurrent agents:',
        default: String(options.runtime.maxAgents),
        validate: (v) => {
          const n = parseInt(v);
          return (!isNaN(n) && n > 0 && n <= 50) || 'Enter a number between 1 and 50';
        },
      });
      options.runtime.maxAgents = parseInt(maxAgents);

      // Memory backend
      const memoryBackend = await select({
        message: 'Select memory backend:',
        options: [
          { value: 'hybrid', label: 'Hybrid', hint: 'SQLite + AgentDB (recommended)' },
          { value: 'agentdb', label: 'AgentDB', hint: '150x faster vector search' },
          { value: 'sqlite', label: 'SQLite', hint: 'Standard SQL storage' },
          { value: 'memory', label: 'In-Memory', hint: 'Fast but non-persistent' },
        ],
      });
      options.runtime.memoryBackend = memoryBackend as InitOptions['runtime']['memoryBackend'];

      // HNSW indexing
      if (memoryBackend === 'agentdb' || memoryBackend === 'hybrid') {
        const enableHNSW = await confirm({
          message: 'Enable HNSW indexing for faster vector search?',
          default: true,
        });
        options.runtime.enableHNSW = enableHNSW;
      }

      // Neural learning
      const enableNeural = await confirm({
        message: 'Enable neural pattern learning?',
        default: options.runtime.enableNeural,
      });
      options.runtime.enableNeural = enableNeural;

      // ADR-049: Self-Learning Memory capabilities
      if (memoryBackend === 'agentdb' || memoryBackend === 'hybrid') {
        const enableSelfLearning = await confirm({
          message: 'Enable self-learning memory? (LearningBridge + Knowledge Graph + Agent Scopes)',
          default: true,
        });
        options.runtime.enableLearningBridge = enableSelfLearning && enableNeural;
        options.runtime.enableMemoryGraph = enableSelfLearning;
        options.runtime.enableAgentScopes = enableSelfLearning;
      } else {
        options.runtime.enableLearningBridge = false;
        options.runtime.enableMemoryGraph = false;
        options.runtime.enableAgentScopes = false;
      }

      // Embeddings configuration
      const enableEmbeddings = await confirm({
        message: 'Enable ONNX embedding system with hyperbolic support?',
        default: true,
      });

      let embeddingModel = 'Xenova/all-MiniLM-L6-v2';
      if (enableEmbeddings) {
        embeddingModel = await select({
          message: 'Select embedding model:',
          options: [
            { value: 'Xenova/all-MiniLM-L6-v2', label: 'MiniLM L6 (384d)', hint: 'Fast, good quality (recommended)' },
            { value: 'Xenova/all-mpnet-base-v2', label: 'MPNet Base (768d)', hint: 'Higher quality, more memory' },
          ],
        });
      }

      // Execute initialization
      output.writeln();
      const spinner = output.createSpinner({ text: 'Initializing...' });
      spinner.start();

      const result = await executeInit(options);

      if (!result.success) {
        spinner.fail('Initialization failed');
        for (const error of result.errors) {
          output.printError(error);
        }
        return { success: false, exitCode: 1 };
      }

      spinner.succeed('Setup complete!');

      // Initialize embeddings if enabled
      let embeddingsInitialized = false;
      if (enableEmbeddings) {
        output.writeln();
        output.printInfo('Initializing ONNX embedding subsystem...');
        const { execFileSync } = await import('child_process');

        // Validate embeddingModel: must match pattern org/model-name (CRIT-02)
        if (!/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+$/.test(embeddingModel)) {
          throw new Error(`Invalid embedding model name: ${embeddingModel}`);
        }

        try {
          execFileSync('npx', [
            '@gemiflow/cli@latest', 'embeddings', 'init',
            '--model', embeddingModel,
            '--no-download', '--force',
          ], {
            stdio: 'pipe',
            cwd: ctx.cwd,
            timeout: 30000,
          });
          output.writeln(output.success('  ✓ Embeddings configured'));
          embeddingsInitialized = true;
        } catch {
          output.writeln(output.dim('  Embeddings will be configured on first use'));
        }
      }

      output.writeln();

      // Summary table
      output.printTable({
        columns: [
          { key: 'setting', header: 'Setting', width: 20 },
          { key: 'value', header: 'Value', width: 40 },
        ],
        data: [
          { setting: 'Preset', value: preset },
          { setting: 'Topology', value: options.runtime.topology },
          { setting: 'Max Agents', value: String(options.runtime.maxAgents) },
          { setting: 'Memory Backend', value: options.runtime.memoryBackend },
          { setting: 'HNSW Indexing', value: options.runtime.enableHNSW ? 'Enabled' : 'Disabled' },
          { setting: 'Neural Learning', value: options.runtime.enableNeural ? 'Enabled' : 'Disabled' },
          { setting: 'Self-Learning', value: options.runtime.enableLearningBridge ? 'LearningBridge + Graph + Scopes' : 'Disabled' },
          { setting: 'Embeddings', value: enableEmbeddings ? `${embeddingModel} (hyperbolic)` : 'Disabled' },
          { setting: 'Skills', value: `${result.summary.skillsCount} installed` },
          { setting: 'Commands', value: `${result.summary.commandsCount} installed` },
          { setting: 'Agents', value: `${result.summary.agentsCount} installed` },
          { setting: 'Hooks', value: `${result.summary.hooksEnabled} enabled` },
        ],
      });

      return { success: true, data: result };
    } catch (error) {
      if (error instanceof Error && error.message === 'User cancelled') {
        output.printInfo('Setup cancelled');
        return { success: true };
      }
      throw error;
    }
  },
};

// Check subcommand
const checkCommand: Command = {
  name: 'check',
  description: 'Check if GemiFlow is initialized',
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const initialized = isInitialized(ctx.cwd);

    const result = {
      initialized: initialized.claude || initialized.gemiflow,
      claude: initialized.claude,
      gemiflow: initialized.gemiflow,
      paths: {
        claudeSettings: initialized.claude ? path.join(ctx.cwd, '.gemiflow', 'settings.json') : null,
        gemiflowConfig: initialized.gemiflow ? path.join(ctx.cwd, '.gemiflow', 'config.yaml') : null,
      },
    };

    if (ctx.flags.format === 'json') {
      output.printJson(result);
      return { success: true, data: result };
    }

    if (result.initialized) {
      output.printSuccess('GemiFlow is initialized');
      if (initialized.claude) {
        output.printInfo(`  Gemini CLI: .gemiflow/settings.json`);
      }
      if (initialized.gemiflow) {
        output.printInfo(`  V3 Runtime: .gemiflow/config.yaml`);
      }
    } else {
      output.printWarning('GemiFlow is not initialized in this directory');
      output.printInfo('Run "gemiflow init" to initialize');
    }

    return { success: true, data: result };
  },
};

// Skills subcommand
const skillsCommand: Command = {
  name: 'skills',
  description: 'Initialize only skills',
  options: [
    { name: 'all', description: 'Install all skills', type: 'boolean', default: false },
    { name: 'core', description: 'Install core skills', type: 'boolean', default: true },
    { name: 'agentdb', description: 'Install AgentDB skills', type: 'boolean', default: false },
    { name: 'github', description: 'Install GitHub skills', type: 'boolean', default: false },
    { name: 'v3', description: 'Install V3 skills', type: 'boolean', default: false },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const options: InitOptions = {
      ...MINIMAL_INIT_OPTIONS,
      targetDir: ctx.cwd,
      force: ctx.flags.force as boolean,
      components: {
        settings: false,
        skills: true,
        commands: false,
        agents: false,
        helpers: false,
        statusline: false,
        mcp: false,
        runtime: false,
        geminiMd: false,
      },
      skills: {
        all: ctx.flags.all as boolean,
        core: ctx.flags.core as boolean,
        agentdb: ctx.flags.agentdb as boolean,
        github: ctx.flags.github as boolean,
        flowNexus: false,
        browser: false,
        v3: ctx.flags.v3 as boolean,
        dualMode: false,
      },
    };

    const spinner = output.createSpinner({ text: 'Installing skills...' });
    spinner.start();

    const result = await executeInit(options);

    if (result.success) {
      spinner.succeed(`Installed ${result.summary.skillsCount} skills`);
    } else {
      spinner.fail('Failed to install skills');
      for (const error of result.errors) {
        output.printError(error);
      }
    }

    return { success: result.success, data: result };
  },
};

// Hooks subcommand
const hooksCommand: Command = {
  name: 'hooks',
  description: 'Initialize only hooks configuration',
  options: [
    { name: 'all', description: 'Enable all hooks', type: 'boolean', default: true },
    { name: 'minimal', description: 'Enable only essential hooks', type: 'boolean', default: false },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const minimal = ctx.flags.minimal as boolean;

    const options: InitOptions = {
      ...DEFAULT_INIT_OPTIONS,
      targetDir: ctx.cwd,
      force: ctx.flags.force as boolean,
      components: {
        settings: true,
        skills: false,
        commands: false,
        agents: false,
        // #2350: helpers MUST ship with the hooks subcommand. The hook entries
        // in settings.json point at `.gemiflow/helpers/hook-handler.cjs`; if
        // that file doesn't exist, settings-generator (#1744 fix) drops the
        // hooks block entirely — so the one subcommand whose stated purpose
        // is "Initialize only hooks configuration" produced settings.json
        // with no `hooks` key while reporting "N hooks enabled".
        helpers: true,
        statusline: false,
        mcp: false,
        runtime: false,
        geminiMd: false,
      },
      hooks: minimal
        ? {
            preToolUse: true,
            postToolUse: true,
            userPromptSubmit: false,
            sessionStart: false,
            stop: false,
            preCompact: false,
            notification: false,
            teammateIdle: false,
            taskCompleted: false,
            timeout: 5000,
            continueOnError: true,
          }
        : DEFAULT_INIT_OPTIONS.hooks,
    };

    const spinner = output.createSpinner({ text: 'Creating hooks configuration...' });
    spinner.start();

    const result = await executeInit(options);

    if (result.success) {
      spinner.succeed(`Created settings.json with ${result.summary.hooksEnabled} hooks enabled`);
    } else {
      spinner.fail('Failed to create hooks configuration');
      for (const error of result.errors) {
        output.printError(error);
      }
    }

    return { success: result.success, data: result };
  },
};

// Upgrade subcommand - updates helpers without losing user data
const upgradeCommand: Command = {
  name: 'upgrade',
  description: 'Update statusline and helpers while preserving existing data',
  options: [
    {
      name: 'verbose',
      short: 'v',
      description: 'Show detailed output',
      type: 'boolean',
      default: false,
    },
    {
      name: 'add-missing',
      short: 'a',
      description: 'Add any new skills, agents, and commands that are missing',
      type: 'boolean',
      default: false,
    },
    {
      name: 'settings',
      short: 's',
      description: 'Merge new settings (Agent Teams, hooks) into existing settings.json',
      type: 'boolean',
      default: false,
    },
  ],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    const addMissing = (ctx.flags['add-missing'] || ctx.flags.addMissing) as boolean;
    const upgradeSettings = (ctx.flags.settings) as boolean;

    output.writeln();
    output.writeln(output.bold('Upgrading GemiFlow'));
    if (addMissing && upgradeSettings) {
      output.writeln(output.dim('Updates helpers, settings, and adds any missing skills/agents/commands'));
    } else if (addMissing) {
      output.writeln(output.dim('Updates helpers and adds any missing skills/agents/commands'));
    } else if (upgradeSettings) {
      output.writeln(output.dim('Updates helpers and merges new settings (Agent Teams, hooks)'));
    } else {
      output.writeln(output.dim('Updates helpers while preserving your existing data'));
    }
    output.writeln();

    const spinnerText = upgradeSettings
      ? 'Upgrading helpers and settings...'
      : (addMissing ? 'Upgrading and adding missing assets...' : 'Upgrading...');
    const spinner = output.createSpinner({ text: spinnerText });
    spinner.start();

    try {
      const result = addMissing
        ? await executeUpgradeWithMissing(ctx.cwd, upgradeSettings)
        : await executeUpgrade(ctx.cwd, upgradeSettings);

      if (!result.success) {
        spinner.fail('Upgrade failed');
        for (const error of result.errors) {
          output.printError(error);
        }
        return { success: false, exitCode: 1 };
      }

      spinner.succeed('Upgrade complete!');
      output.writeln();

      // Show what was updated
      if (result.updated.length > 0) {
        output.printBox(
          result.updated.map(f => `✓ ${f}`).join('\n'),
          'Updated (latest version)'
        );
        output.writeln();
      }

      // Show what was created
      if (result.created.length > 0) {
        output.printBox(
          result.created.map(f => `+ ${f}`).join('\n'),
          'Created (new files)'
        );
        output.writeln();
      }

      // Show what was preserved
      if (result.preserved.length > 0 && ctx.flags.verbose) {
        output.printBox(
          result.preserved.map(f => `• ${f}`).join('\n'),
          'Preserved (existing data kept)'
        );
        output.writeln();
      } else if (result.preserved.length > 0) {
        output.printInfo(`Preserved ${result.preserved.length} existing data files`);
        output.writeln();
      }

      // Show added assets (when --add-missing flag is used)
      if (result.addedSkills && result.addedSkills.length > 0) {
        output.printBox(
          result.addedSkills.map(s => `+ ${s}`).join('\n'),
          `Added Skills (${result.addedSkills.length} new)`
        );
        output.writeln();
      }

      if (result.addedAgents && result.addedAgents.length > 0) {
        output.printBox(
          result.addedAgents.map(a => `+ ${a}`).join('\n'),
          `Added Agents (${result.addedAgents.length} new)`
        );
        output.writeln();
      }

      if (result.addedCommands && result.addedCommands.length > 0) {
        output.printBox(
          result.addedCommands.map(c => `+ ${c}`).join('\n'),
          `Added Commands (${result.addedCommands.length} new)`
        );
        output.writeln();
      }

      // Show settings updates
      if (result.settingsUpdated && result.settingsUpdated.length > 0) {
        output.printBox(
          result.settingsUpdated.map(s => `+ ${s}`).join('\n'),
          'Settings Updated'
        );
        output.writeln();
      }

      output.printSuccess('Your statusline helper has been updated to the latest version');
      output.printInfo('Existing metrics and learning data were preserved');

      // Show settings summary
      if (upgradeSettings && result.settingsUpdated && result.settingsUpdated.length > 0) {
        output.printSuccess('Settings.json updated with new Agent Teams configuration');
      }

      // Show summary for --add-missing
      if (addMissing) {
        const totalAdded = (result.addedSkills?.length || 0) + (result.addedAgents?.length || 0) + (result.addedCommands?.length || 0);
        if (totalAdded > 0) {
          output.printSuccess(`Added ${totalAdded} missing assets to your project`);
        } else {
          output.printInfo('All skills, agents, and commands are already up to date');
        }
      }

      if (ctx.flags.format === 'json') {
        output.printJson(result);
      }

      return { success: true, data: result };
    } catch (error) {
      spinner.fail('Upgrade failed');
      output.printError(`Failed to upgrade: ${error instanceof Error ? error.message : String(error)}`);
      return { success: false, exitCode: 1 };
    }
  },
};

// Main init command
export const initCommand: Command = {
  name: 'init',
  description: 'Initialize GemiFlow in the current directory',
  subcommands: [wizardCommand, checkCommand, skillsCommand, hooksCommand, upgradeCommand],
  options: [
    {
      name: 'force',
      short: 'f',
      description: 'Overwrite existing configuration',
      type: 'boolean',
      default: false,
    },
    {
      name: 'minimal',
      short: 'm',
      description: 'Create minimal configuration',
      type: 'boolean',
      default: false,
    },
    {
      name: 'full',
      description: 'Create full configuration with all components',
      type: 'boolean',
      default: false,
    },
    {
      // #2356: under --full, the auth-gated cloud MCP servers (ruv-swarm,
      // flow-nexus) get written into a committed .mcp.json and add MCP
      // tool-definition token cost every session. Keep them opt-in even with
      // --full; pass --cloud-mcp to register them.
      name: 'cloud-mcp',
      description: 'Register auth-gated cloud MCP servers (ruv-swarm, flow-nexus) in .mcp.json (only relevant with --full)',
      type: 'boolean',
      default: false,
    },
    {
      name: 'skip-claude',
      description: 'Skip .gemiflow/ directory creation (runtime only)',
      type: 'boolean',
      default: false,
    },
    {
      name: 'only-claude',
      description: 'Only create .gemiflow/ directory (skip runtime)',
      type: 'boolean',
      default: false,
    },
    {
      name: 'no-global',
      description: 'Skip the ~/.gemiflow/CLAUDE.md "GemiFlow Integration" pointer block (#1744)',
      type: 'boolean',
      default: false,
    },
    {
      name: 'start-all',
      description: 'Auto-start daemon, memory, and swarm after init',
      type: 'boolean',
      default: false,
    },
    {
      name: 'start-daemon',
      description: 'Auto-start daemon after init',
      type: 'boolean',
      default: false,
    },
    {
      name: 'with-embeddings',
      description: 'Initialize ONNX embedding subsystem with hyperbolic support',
      type: 'boolean',
      default: false,
    },
    {
      name: 'embedding-model',
      description: 'ONNX embedding model to use',
      type: 'string',
      default: 'Xenova/all-MiniLM-L6-v2',
      choices: ['Xenova/all-MiniLM-L6-v2', 'Xenova/all-mpnet-base-v2'],
    },
    {
      name: 'gemini',
      description: 'Initialize for OpenAI gemini CLI (creates AGENTS.md, .agents/)',
      type: 'boolean',
      default: false,
    },
    {
      name: 'dual',
      description: 'Initialize for both Gemini CLI and OpenAI gemini',
      type: 'boolean',
      default: false,
    },
    {
      name: 'all-agents',
      description: 'Install all agent categories (ADR-128: default is ~24 substrate agents; this restores the full set of ~89)',
      type: 'boolean',
      default: false,
    },
  ],
  examples: [
    { command: 'gemiflow init', description: 'Initialize with default configuration' },
    { command: 'gemiflow init --start-all', description: 'Initialize and start daemon, memory, swarm' },
    { command: 'gemiflow init --start-daemon', description: 'Initialize and start daemon only' },
    { command: 'gemiflow init --minimal', description: 'Initialize with minimal configuration' },
    { command: 'gemiflow init --full', description: 'Initialize with all components' },
    { command: 'gemiflow init --force', description: 'Reinitialize and overwrite existing config' },
    { command: 'gemiflow init --only-claude', description: 'Only create Gemini CLI integration' },
    { command: 'gemiflow init --skip-claude', description: 'Only create V3 runtime' },
    { command: 'gemiflow init wizard', description: 'Interactive setup wizard' },
    { command: 'gemiflow init --with-embeddings', description: 'Initialize with ONNX embeddings' },
    { command: 'gemiflow init --with-embeddings --embedding-model Xenova/all-mpnet-base-v2', description: 'Use larger embedding model' },
    { command: 'gemiflow init skills --all', description: 'Install all available skills' },
    { command: 'gemiflow init hooks --minimal', description: 'Create minimal hooks configuration' },
    { command: 'gemiflow init upgrade', description: 'Update helpers while preserving data' },
    { command: 'gemiflow init upgrade --settings', description: 'Update helpers and merge new settings (Agent Teams)' },
    { command: 'gemiflow init upgrade --verbose', description: 'Show detailed upgrade info' },
    { command: 'gemiflow init --gemini', description: 'Initialize for OpenAI gemini (AGENTS.md)' },
    { command: 'gemiflow init --gemini --full', description: 'gemini init with all 137+ skills' },
    { command: 'gemiflow init --dual', description: 'Initialize for both Gemini CLI and gemini' },
    { command: 'gemiflow init --all-agents', description: 'Install all agent categories (~89 agents; ADR-128 opt-in)' },
  ],
  action: initAction,
};

export default initCommand;
