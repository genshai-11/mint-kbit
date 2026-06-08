import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import { visualizer } from 'rollup-plugin-visualizer'

function copyOptimizedAssets(): Plugin {
  return {
    name: 'copy-optimized-assets',
    async writeBundle() {
      const source = resolve(process.cwd(), 'data/assets-opt')
      const target = resolve(process.cwd(), 'dist/data/assets-opt')

      await rm(target, { recursive: true, force: true })
      await mkdir(target, { recursive: true })
      await cp(source, target, { recursive: true })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    imagetools(),
    copyOptimizedAssets(),
    mode === 'analyze' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
  ].filter(Boolean),
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@data': '/data',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['@phosphor-icons/react'],
        },
      },
    },
  },
}))
