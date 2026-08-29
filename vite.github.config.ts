import path from 'node:path';
import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'github',
  base: './',
  publicDir: path.resolve('public'),
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('.'),
    },
  },
  build: {
    outDir: path.resolve('dist-github'),
    emptyOutDir: true,
  },
});
