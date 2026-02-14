import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Isso força o Vite a olhar para a raiz, onde seu index.html está
  root: './',
  build: {
    outDir: 'dist',
  }
})


