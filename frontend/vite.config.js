import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {target: 'http://localhost:8080', changeOrigin: true,rewrite: (path) => (path.startsWith('/api') ? path.replace(/^\/api/, '') : path)},
      '/socket.io': {target: 'ws://localhost:8080',ws:true, changeOrigin: true},
      '/auth': {target: 'http://localhost:4000', changeOrigin: true,rewrite: (path) => (path.startsWith('/auth') ? path.replace(/^\/auth/, '') : path)}
  }},
})
