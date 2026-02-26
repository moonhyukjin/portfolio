import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
    // Increase warning threshold (Three.js is intentionally large)
    chunkSizeWarningLimit: 700,
  },
});
