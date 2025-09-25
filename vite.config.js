import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
         port: 5174, // Fixed port
         proxy: {
           '/api': {
             target: 'http://localhost:8080',
             changeOrigin: true,
             rewrite: (path) => path.replace(/^\/api/, ''),
             secure: false,
           },
           '/auth': {
             target: 'http://localhost:8080',
             changeOrigin: true,
             secure: false,
             ws: true,
             configure: (proxy, _options) => {
               proxy.on('proxyRes', (proxyRes, req, res) => {
                 const cookies = proxyRes.headers['set-cookie'];
                 if (cookies) {
                   res.setHeader('set-cookie', cookies);
                 }
               });
             }
           },
         },
       },
  build: {
    outDir: '../frontend/dist'
  }
})
