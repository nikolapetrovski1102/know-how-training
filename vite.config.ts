import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true,
    allowedHosts: true
  },
  envPrefix: 'VITE_',
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL),
  },
})
