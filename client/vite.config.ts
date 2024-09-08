import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:5001',  // .NET backend URL
        changeOrigin: true,
        secure: false
      }
    }
  }
})
