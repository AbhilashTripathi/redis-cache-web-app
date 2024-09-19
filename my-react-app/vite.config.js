import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  //Local:   http://127.0.0.1:5173/, Network: use --host to expose the dev server to the network
  // server: {
  //   host: true,
  //   port: 5173,
  // },
})
