import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.{test,spec}.{js,mjs}'],
    exclude: ['test/e2e/**', 'test/ui/**', 'node_modules/**'],
    globals: false,
  },
})
