import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: `${process.env.VITE_AFFILIATE_URL || 'https://invoice-saas-backend-58pc.onrender.com'}`,
        changeOrigin: true,
      },
    },
  },
})