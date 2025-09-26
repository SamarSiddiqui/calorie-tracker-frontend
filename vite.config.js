// 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: '/', // Correct for Vercel
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/calories': 'http://localhost:8080',
    },
  },
});