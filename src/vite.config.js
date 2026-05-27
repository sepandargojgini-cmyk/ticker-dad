import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Targets browsers with native ES Modules, dynamic imports, and import.meta support (ES2022+)
    target: 'es2022',
  },
  esbuild: {
    // Configures esbuild to allow import.meta syntax without warning or shimming
    target: 'es2022',
    supported: {
      'import-meta': true
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Configures the local dependency pre-bundler target
      target: 'es2022',
    }
  }
});