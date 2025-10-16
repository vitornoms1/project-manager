import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', 
        changeOrigin: true,
        
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Requisição para o proxy recebida:', req.method, req.url);
          });
          proxy.on('error', (err, req, res) => {
            console.error('Erro no proxy:', err);
          });
        }
      },
    }
  }
})