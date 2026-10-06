import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/* Unit tests run in Node against the source files. Browser tests live in tests/e2e (Playwright). */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
})
