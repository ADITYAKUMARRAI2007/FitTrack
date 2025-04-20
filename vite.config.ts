// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // This allows Vite to listen on all addresses (0.0.0.0)
    port: 5173,        // Default port, can change if needed
  },
});