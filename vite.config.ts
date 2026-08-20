import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const themeDirectory = resolve(import.meta.dirname, 'wp-content/themes/orlyata');

export default defineConfig({
  base: '/wp-content/themes/orlyata/assets/dist/',
  build: {
    outDir: resolve(themeDirectory, 'assets/dist'),
    emptyOutDir: true,
    manifest: 'manifest.json',
    rollupOptions: {
      input: {
        theme: resolve(themeDirectory, 'assets/src/main.ts'),
      },
    },
  },
});

