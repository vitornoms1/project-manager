import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // MUDANÇA 1: Usamos o endereço IP em vez de 'localhost'. 
        // Isso às vezes contorna regras de segurança de rede.
        target: 'http://127.0.0.1:5000', 
        changeOrigin: true,
        
        // MUDANÇA 2: Adicionamos um log para ver a requisição no terminal do VITE.
        // Isso nos dará a prova de que o proxy está sendo acionado.
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