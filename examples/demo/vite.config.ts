import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    watch: {
      // Watch the src directory for changes
      ignored: ['!**/src/**'],
    },
  },
  resolve: {
    alias: {
      '../../src': path.resolve(__dirname, '../../src'),
    },
  },
})
