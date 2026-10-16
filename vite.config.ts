import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// Relative base keeps GitHub Pages working for project sites and user sites.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    port: 43123,
    // Listen on all interfaces so Cursor/cloud port forwarding can reach the app.
    host: '0.0.0.0',
    strictPort: true,
    // Same-origin proxy so browser-held OpenAI keys avoid CORS (dev / preview only).
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/openai/, '/v1'),
      },
    },
  },
  preview: {
    port: 43123,
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/openai/, '/v1'),
      },
    },
  },
})

