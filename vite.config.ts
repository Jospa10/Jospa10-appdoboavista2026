import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Isso diz ao Vite: "O index.html está aqui na pasta principal, não procure na pasta src"
  root: './', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
})
