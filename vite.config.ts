import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Express server (server/index.ts) listens on 3001; Vite forwards /api calls to it.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
  preview: {
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
});
