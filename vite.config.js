import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
})
// VITE_API_BASE_URL="http://10.249.0.23:8080/api";