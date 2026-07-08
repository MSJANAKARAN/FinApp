import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],server: {
    port: 5555, // Changes localhost:5173 to localhost:port
    host: true // Listens on all addresses, including LAN and public IPs
  }
})
