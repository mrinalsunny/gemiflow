/**
 * GemiFlow V3 - Modular AI Agent Coordination System
 *
 * This is the main entry point that re-exports all @gemiflow modules.
 * Each module can also be imported directly for tree-shaking.
 *
 * @example
 * // Import everything
 * import * as gemiflow from '@gemiflow/v3';
 *
 * // Or import specific modules
 * import { UnifiedSwarmCoordinator } from '@gemiflow/swarm';
 * import { PasswordHasher } from '@gemiflow/security';
 * import { HNSWIndex } from '@gemiflow/memory';
 *
 * Complete reimagining based on 10 ADRs:
 * - ADR-001: Adopt agentic-flow as core foundation
 * - ADR-002: Domain-Driven Design structure
 * - ADR-003: Single coordination engine
 * - ADR-004: Plugin-based architecture
 * - ADR-005: MCP-first API design
 * - ADR-006: Unified memory service
 * - ADR-007: Event sourcing for state changes
 * - ADR-008: Vitest over Jest
 * - ADR-009: Hybrid memory backend default
 * - ADR-010: Remove Deno support (Node.js 20+ only)
 *
 * Performance Targets:
 * - Flash Attention: 2.49x-7.47x speedup
 * - AgentDB Search: 150x-12,500x improvement
 * - Memory Reduction: 50-75%
 * - Code Reduction: <5,000 lines (vs 15,000+)
 * - Startup Time: <500ms
 *
 * @module @gemiflow/v3
 * @version 3.0.0-alpha.1
 */

// =============================================================================
// @gemiflow Module Exports (New Modular Architecture)
// =============================================================================

/**
 * Security module - CVE fixes, input validation, credential management
 * @see {@link @gemiflow/security}
 */
export * as security from './@gemiflow/security/src/index.js';

/**
 * Memory module - AgentDB, HNSW indexing, vector search
 * @see {@link @gemiflow/memory}
 */
export * as memory from './@gemiflow/memory/src/index.js';

/**
 * Swarm module - 15-agent coordination, hierarchical mesh, consensus
 * @see {@link @gemiflow/swarm}
 */
export * as swarm from './@gemiflow/swarm/src/index.js';

/**
 * Integration module - agentic-flow@alpha integration, ADR-001 compliance
 * @see {@link @gemiflow/integration}
 */
export * as integration from './@gemiflow/integration/src/index.js';

/**
 * Shared module - common types, events, utilities, core interfaces
 * @see {@link @gemiflow/shared}
 */
export * as shared from './@gemiflow/shared/src/index.js';

/**
 * CLI module - Command parsing, prompts, output formatting
 * @see {@link @gemiflow/cli}
 */
export * as cli from './@gemiflow/cli/src/index.js';

/**
 * Neural module - SONA learning, neural modes
 * @see {@link @gemiflow/neural}
 */
export * as neural from './@gemiflow/neural/src/index.js';

/**
 * Performance module - Benchmarking, Flash Attention validation
 * @see {@link @gemiflow/performance}
 */
export * as performance from './@gemiflow/performance/src/index.js';

/**
 * Testing module - TDD London School framework, test utilities
 * @see {@link @gemiflow/testing}
 */
export * as testing from './@gemiflow/testing/src/index.js';

/**
 * Deployment module - Release management, CI/CD
 * @see {@link @gemiflow/deployment}
 */
export * as deployment from './@gemiflow/deployment/src/index.js';

// =============================================================================
// Module List for Dynamic Loading
// =============================================================================

export const MODULES = [
  '@gemiflow/shared',
  '@gemiflow/security',
  '@gemiflow/memory',
  '@gemiflow/swarm',
  '@gemiflow/integration',
  '@gemiflow/cli',
  '@gemiflow/neural',
  '@gemiflow/performance',
  '@gemiflow/testing',
  '@gemiflow/deployment',
] as const;

export type ModuleName = (typeof MODULES)[number];

// =============================================================================
// Legacy Compatibility Layer (Gradual Migration Support)
// =============================================================================

// =============================================================================
// V3 Core Architecture (Decomposed Orchestrator)
// =============================================================================

// Core Interfaces
export type {
  // Task interfaces
  ITask,
  ITaskCreate,
  ITaskResult,
  ITaskManager,
  ITaskQueue,
  TaskManagerMetrics,

  // Agent interfaces
  IAgent,
  IAgentConfig,
  IAgentSession,
  IAgentPool,
  IAgentLifecycleManager,
  IAgentRegistry,
  IAgentCapability,

  // Event interfaces
  IEvent,
  IEventCreate,
  IEventBus as IEventBusCore,
  IEventHandler,
  IEventSubscription,
  IEventFilter,
  IEventStore,
  IEventCoordinator,

  // Memory interfaces
  IMemoryEntry,
  IMemoryEntryCreate,
  IMemoryBackend,
  IVectorMemoryBackend,
  IMemoryBank,
  IMemoryManager,
  IPatternStorage,
  IVectorSearchParams,
  IVectorSearchResult,

  // Coordinator interfaces
  ISwarmConfig,
  ISwarmState,
  ICoordinator,
  ICoordinationManager,
  IHealthMonitor,
  IMetricsCollector,
  IHealthStatus,
  IComponentHealth,
  IOrchestratorMetrics,
} from './@gemiflow/shared/src/core/index.js';

export { SystemEventTypes } from './@gemiflow/shared/src/core/index.js';

// Orchestrator Components
export {
  // Task management
  TaskManager,
  TaskQueue,

  // Session management
  SessionManager,
  type ISessionManager,
  type SessionManagerConfig,
  type SessionPersistence,

  // Health monitoring
  HealthMonitor,
  type HealthMonitorConfig,
  type HealthCheckFn,

  // Lifecycle management
  LifecycleManager,
  AgentPool,
  type LifecycleManagerConfig,

  // Event coordination
  EventCoordinator,

  // Factory function
  createOrchestrator,
  defaultOrchestratorConfig,
  type OrchestratorConfig,
  type OrchestratorComponents,
} from './@gemiflow/shared/src/core/index.js';

// Event Bus
export { EventBus as EventBusCore, createEventBus } from './@gemiflow/shared/src/core/index.js';

// Configuration
export {
  // Schemas
  AgentConfigSchema,
  TaskConfigSchema,
  SwarmConfigSchema,
  MemoryConfigSchema,
  MCPServerConfigSchema,
  OrchestratorConfigSchema,
  SystemConfigSchema,

  // Validation
  validateAgentConfig,
  validateTaskConfig,
  validateSwarmConfig,
  validateMemoryConfig,
  validateMCPServerConfig,
  validateOrchestratorConfig,
  validateSystemConfig,
  ConfigValidator,
  type ValidationResult,
  type ValidationError,

  // Defaults
  defaultAgentConfig,
  defaultTaskConfig,
  defaultSwarmConfigCore,
  defaultMemoryConfig,
  defaultMCPServerConfig,
  defaultSystemConfig,
  agentTypePresets,
  mergeWithDefaults,

  // Loader
  ConfigLoader,
  loadConfig,
  type LoadedConfig,
  type ConfigSource,
} from './@gemiflow/shared/src/core/index.js';

// V3 Extended Types
export type {
  // Agent types
  AgentProfile,
  AgentPermissions,
  AgentSpawnOptions,
  AgentSpawnResult,
  AgentTerminationOptions,
  AgentTerminationResult,
  AgentHealthCheckResult,
  AgentBatchResult,
  AgentEventPayloads,

  // Task types
  TaskInput,
  TaskMetadata as TaskMetadataExtended,
  TaskExecutionContext,
  TaskExecutionResult,
  TaskArtifact,
  TaskQueueConfig,
  TaskAssignmentConfig,
  TaskRetryPolicy,
  TaskFilter,
  TaskSortOptions,
  TaskQueryOptions,
  TaskEventPayloads,

  // Swarm types
  SwarmInitOptions,
  SwarmInitResult,
  SwarmScaleOptions,
  SwarmScaleResult,
  SwarmMessage,
  ConsensusRequest,
  ConsensusResponse,
  DistributedLock,
  LockAcquisitionResult,
  DeadlockDetectionResult,
  SwarmMetrics as SwarmMetricsExtended,
  SwarmEventPayloads,

  // Memory types
  MemoryBackendConfig,
  MemoryStoreOptions,
  MemoryRetrieveOptions,
  MemoryListOptions,
  MemorySearchOptions,
  MemoryBatchOperation,
  MemoryBatchResult,
  MemoryStats,
  MemoryBankStats,
  LearnedPattern,
  PatternSearchResult,
  MemoryEventPayloads,
  CacheConfig,
  VectorIndexConfig,
  FlashAttentionConfig,

  // MCP types
  MCPTool,
  MCPToolHandler,
  MCPToolResult,
  MCPContent,
  MCPServerConfig as MCPServerConfigExtended,
  MCPTransportConfig,
  MCPResource,
  MCPPrompt,
  MCPCapabilities,
  MCPRequest,
  MCPResponse,
  MCPError,
  MCPEventPayloads,
  MCPServerStatus,
} from './@gemiflow/shared/src/types/index.js';

export {
  priorityToNumber,
  numberToPriority,
  TopologyPresets,
} from './@gemiflow/shared/src/types/index.js';

// =============================================================================
// Legacy/Shared Exports (Preserved for Backward Compatibility)
// =============================================================================

// Agent Registry
export type {
  HealthStatus
} from './@gemiflow/swarm/src/coordination/agent-registry.js';

export {
  AgentRegistry,
  createAgentRegistry
} from './@gemiflow/swarm/src/coordination/agent-registry.js';

// Task Orchestrator
export type {
  ITaskOrchestrator,
  TaskSpec,
  TaskOrchestratorMetrics
} from './@gemiflow/swarm/src/coordination/task-orchestrator.js';

export {
  TaskOrchestrator,
  createTaskOrchestrator
} from './@gemiflow/swarm/src/coordination/task-orchestrator.js';

// Swarm Hub
export type {
  ISwarmHub
} from './@gemiflow/swarm/src/coordination/swarm-hub.js';

export {
  SwarmHub,
  createSwarmHub,
  getSwarmHub,
  resetSwarmHub
} from './@gemiflow/swarm/src/coordination/swarm-hub.js';

// Configuration
export type {
  V3SwarmConfig,
  DomainConfig,
  PhaseConfig,
  GitHubConfig,
  LoggingConfig,
  TopologyConfig
} from './swarm.config';

export {
  defaultSwarmConfig,
  agentRoleMapping,
  getAgentsByDomain,
  getAgentConfig,
  getPhaseConfig,
  getActiveAgentsForPhase,
  createCustomConfig,
  topologyConfigs,
  getTopologyConfig
} from './swarm.config';

// =============================================================================
// Quick Start Functions
// =============================================================================

/**
 * Initialize the V3 swarm with default configuration
 *
 * @example
 * ```typescript
 * import { initializeV3Swarm } from './v3';
 *
 * const swarm = await initializeV3Swarm();
 * await swarm.spawnAllAgents();
 *
 * // Submit a task
 * const task = swarm.submitTask({
 *   type: 'implementation',
 *   title: 'Implement feature X',
 *   description: 'Detailed description...',
 *   domain: 'core',
 *   phase: 'phase-2-core',
 *   priority: 'high'
 * });
 * ```
 */
export async function initializeV3Swarm(config?: Partial<SwarmConfig>): Promise<ISwarmHub> {
  const { createSwarmHub } = await import('./@gemiflow/swarm/src/coordination/swarm-hub.js');
  const swarm = createSwarmHub();
  await swarm.initialize(config as any);
  return swarm;
}

/**
 * Get the current V3 swarm instance
 * Creates a new one if none exists
 */
export async function getOrCreateSwarm(): Promise<ISwarmHub> {
  const { getSwarmHub } = await import('./@gemiflow/swarm/src/coordination/swarm-hub.js');
  const swarm = getSwarmHub();

  if (!swarm.isInitialized()) {
    await swarm.initialize();
  }

  return swarm;
}

// =============================================================================
// Version Info
// =============================================================================

export const V3_VERSION = {
  major: 3,
  minor: 0,
  patch: 0,
  prerelease: 'alpha',
  full: '3.0.0-alpha',
  buildDate: new Date().toISOString()
};

export const V3_INFO = {
  name: 'gemiflow',
  version: V3_VERSION.full,
  description: 'Complete reimagining of GemiFlow with 15-agent hierarchical mesh swarm',
  repository: 'https://github.com/ruvnet/gemiflow',
  license: 'MIT',
  engines: {
    node: '>=20.0.0'
  },
  features: [
    'agentic-flow integration (ADR-001)',
    'Domain-Driven Design (ADR-002)',
    'Single coordination engine (ADR-003)',
    'Plugin architecture (ADR-004)',
    'MCP-first API (ADR-005)',
    'Unified memory service (ADR-006)',
    'Event sourcing (ADR-007)',
    'Vitest testing (ADR-008)',
    'Hybrid memory backend (ADR-009)',
    'Node.js 20+ focus (ADR-010)'
  ],
  performanceTargets: {
    flashAttention: '2.49x-7.47x speedup',
    agentDbSearch: '150x-12,500x improvement',
    memoryReduction: '50-75%',
    codeReduction: '<5,000 lines',
    startupTime: '<500ms'
  },
  agents: {
    total: 15,
    topology: 'hierarchical-mesh',
    domains: ['security', 'core', 'integration', 'quality', 'performance', 'deployment']
  }
};

// =============================================================================
// Default Export
// =============================================================================

import type { ISwarmHub } from './@gemiflow/swarm/src/coordination/swarm-hub.js';
import type { ISwarmConfig as SwarmConfig } from './@gemiflow/shared/src/core/index.js';
const PERF_TARGETS = V3_INFO.performanceTargets;

export default {
  // Quick start
  initializeV3Swarm,
  getOrCreateSwarm,

  // Version info
  version: V3_VERSION,
  info: V3_INFO,

  // Performance targets
  performanceTargets: PERF_TARGETS
};
