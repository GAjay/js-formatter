import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** GitHub Pages project site: https://<user>.github.io/js-formatter/ */
const ghPagesBase = '/js-formatter/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? ghPagesBase : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  worker: {
    format: 'es',
  },
}));
