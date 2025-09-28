// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(),react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Import the 'path' module from Node.js

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // Add the 'resolve' object to configure the path alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})