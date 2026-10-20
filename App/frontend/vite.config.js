import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxies /api to the Express backend so the browser only ever talks to one
// origin. VITE_API_PROXY_TARGET is set by docker-compose for the containerized
// setup (http://api:3000); it defaults to localhost for running outside Docker.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
