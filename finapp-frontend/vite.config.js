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
    host:"0.0.0.0" ,// Listens on all available network interfaces, i mean access over internet ex: hosting in EC2 similar to host: true
    strictPort: false //Port 5555 is already in use. The server won't start until the port is free.(if false, will change to localhost:5556)

// Local:   http://localhost:5555/ -> Access the app from the same machine where Vite is running.
// Network: http://172.31.46.243:5555/ -> private IP of your instance (like EC2 inside AWS).
  }
})
