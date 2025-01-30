// vite.config.js
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'AnyaltWidget',
      formats: ['es', 'cjs'],
      fileName: (format) => `anyalt-widget.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
    minify: 'terser',
  },
});
