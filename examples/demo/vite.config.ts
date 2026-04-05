import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/charcoal/',  // GitHub Pages serves from /charcoal/
  server: {
    watch: {
      ignored: ['!**/src/**'],
    },
  },
  resolve: {
    alias: {
      '../../src': path.resolve(__dirname, '../../src'),
    },
  },
  build: {
    outDir: '../../docs',  // GitHub Pages can serve from /docs
    emptyOutDir: true,
  },
})
