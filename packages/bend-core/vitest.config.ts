import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    alias: {
      '@templates': './src/scaffold/templates/stacks'
    }
  },
  resolve: {
    alias: {
      '@templates': './src/scaffold/templates/stacks'
    }
  }
});
