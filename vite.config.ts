import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// Vite configuration
export default defineConfig({
  plugins: [
    // React plugin for handling React-specific features
    react(),
    // DTS plugin for generating TypeScript declaration files
    dts({
      include: ['src'], // Ensure TypeScript definitions are generated for all source files
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/AnyaltWidget.tsx'), // Entry point for the library
      name: 'AnyaltWidget', // Name of the global variable for UMD builds
      formats: ['es', 'umd'], // Generate both ES and UMD module formats
      fileName: (format) => `anyalt-widget.${format}.js`, // Output file naming convention
    },
    rollupOptions: {
      // Mark these dependencies as external to avoid bundling them
      external: ['react', 'react-dom'],
      output: {
        // Globals for UMD builds
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    // Minimize the output by default
    minify: 'esbuild', // Use esbuild for faster builds and smaller output
  },
  optimizeDeps: {
    // Ensure dependencies are pre-bundled for faster builds
    include: ['react', 'react-dom'],
  },
});
