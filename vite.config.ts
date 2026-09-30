import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
// Project is served from https://<user>.github.io/personal/ on GitHub Pages,
// Production builds and previews share the sub-path; development stays at root.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/personal/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep shared React code out of the lazy WebGL chunks so Three.js
          // does not become a dependency of the initial page bundle.
          vendor: ['react', 'react-dom', 'framer-motion'],
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/postprocessing'],
        },
      },
    },
  },
}));
