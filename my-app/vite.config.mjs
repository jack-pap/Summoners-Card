import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  root: '.',
  server: {
    proxy: {
      '/assets': 'http://localhost:3001',
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  plugins: [react()],
});
