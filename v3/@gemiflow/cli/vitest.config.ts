import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    conditions: ['node'],
  },
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    globals: true,
    coverage: {
      enabled: false,
    },
    server: {
      deps: {
        external: [
          /agentic-flow/,
          /agentdb/,
          /@ruvector\/.*/,
          /@huggingface\/transformers/,
          /@xenova\/transformers/,
          /@noble\/ed25519/
        ],
      },
    },
  },
});
