import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),  tailwindcss()],
    server: {
      allowedHosts: ["ag-fe.bury.local","agmap.bury.local","ag.bury.link", "ag.bury.local"]
    }
})
