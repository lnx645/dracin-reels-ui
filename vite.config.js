import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  // Base '/' (bukan './') — WAJIB untuk router: di rute dalam seperti
  // /watch/ceo/1, base relatif akan membuat aset JS/CSS 404 dan halaman blank.
  base: '/'
})
