import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/auth': 'http://localhost:3001',
      '/users': 'http://localhost:3001',
      '/dashboard': 'http://localhost:3001',
      '/clients': 'http://localhost:3001',
      '/cases': 'http://localhost:3001',
      '/bookings': 'http://localhost:3001',
      '/billing': 'http://localhost:3001',
      '/documents': 'http://localhost:3001',
      '/practice-areas': 'http://localhost:3001',
      '/inquiry': 'http://localhost:3001',
      '/articles': 'http://localhost:3001',
    }
  }
})
