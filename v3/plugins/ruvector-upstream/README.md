# RuVector Upstream WASM Packages

This directory contains references and integration bridges for upstream RuVector WASM packages used by GemiFlow plugins.

## Available WASM Packages

| Package | Category | Description |
|---------|----------|-------------|
| `micro-hnsw-wasm` | Vector Search | Ultra-fast HNSW vector similarity search |
| `ruvector-attention-wasm` | Neural | Flash attention mechanism (2.49x-7.47x speedup) |
| `ruvector-gnn-wasm` | Graph | Graph Neural Networks for relationship modeling |
| `ruvector-hyperbolic-hnsw-wasm` | Embeddings | Hyperbolic embeddings in Poincaré ball model |
| `ruvector-learning-wasm` | Learning | Reinforcement learning algorithms |
| `ruvector-nervous-system-wasm` | Coordination | Neural coordination for multi-agent systems |
| `ruvector-economy-wasm` | Economics | Token economics and resource allocation |
| `ruvector-exotic-wasm` | Quantum | Quantum-inspired optimization algorithms |
| `ruvector-sparse-inference-wasm` | Inference | Sparse matrix inference for efficiency |
| `ruvector-tiny-dancer-wasm` | Inference | Lightweight model inference (<5MB) |
| `ruvector-mincut-wasm` | Graph | Graph mincut algorithms for partitioning |
| `ruvector-fpga-transformer-wasm` | Accelerated | FPGA-accelerated transformer operations |
| `ruvector-dag-wasm` | Graph | Directed Acyclic Graph processing |
| `cognitum-gate-kernel` | Cognitive | Cognitive computation kernels |
| `sona` | Neural | Self-Optimizing Neural Architecture |

## Upstream Repository

All packages are sourced from: https://github.com/mrinalsunny/ruvector

## Plugin Dependencies

| Plugin | Primary WASM Packages |
|--------|----------------------|
| `@gemiflow/plugin-healthcare-cds` | micro-hnsw-wasm, ruvector-gnn-wasm, ruvector-hyperbolic-hnsw-wasm |
| `@gemiflow/plugin-financial-risk` | micro-hnsw-wasm, ruvector-economy-wasm, ruvector-sparse-inference-wasm |
| `@gemiflow/plugin-legal-contracts` | micro-hnsw-wasm, ruvector-attention-wasm, ruvector-dag-wasm |
| `@gemiflow/plugin-code-intelligence` | micro-hnsw-wasm, ruvector-gnn-wasm, ruvector-mincut-wasm, sona |
| `@gemiflow/plugin-test-intelligence` | ruvector-learning-wasm, ruvector-gnn-wasm, sona |
| `@gemiflow/plugin-perf-optimizer` | ruvector-sparse-inference-wasm, ruvector-fpga-transformer-wasm |
| `@gemiflow/plugin-neural-coordination` | sona, ruvector-nervous-system-wasm, ruvector-attention-wasm |
| `@gemiflow/plugin-cognitive-kernel` | cognitum-gate-kernel, sona, ruvector-attention-wasm |
| `@gemiflow/plugin-quantum-optimizer` | ruvector-exotic-wasm, ruvector-hyperbolic-hnsw-wasm |
| `@gemiflow/plugin-hyperbolic-reasoning` | ruvector-hyperbolic-hnsw-wasm, ruvector-attention-wasm |

## Installation

```bash
# Install specific WASM bridges
npm install @ruvector/micro-hnsw-wasm
npm install @ruvector/attention-wasm
npm install @ruvector/gnn-wasm
```

## Integration Pattern

```typescript
import { initMicroHnsw } from '@ruvector/micro-hnsw-wasm';
import { FlashAttention } from '@ruvector/attention-wasm';

// Initialize WASM modules
const hnsw = await initMicroHnsw();
const attention = await FlashAttention.init();

// Use in GemiFlow plugin
export const plugin: gemiflowPlugin = {
  name: '@gemiflow/plugin-example',
  bridges: {
    hnsw,
    attention,
  },
};
```
