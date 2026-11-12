import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'threads',
    testTimeout: 20000,
  },
  resolve: {
    preserveSymlinks: true,
  },
});
