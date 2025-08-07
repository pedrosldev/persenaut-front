// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path' // Necesario para resolver rutas absolutas

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                // Lista todas tus páginas HTML aquí:
                main: resolve(__dirname, 'index.html'),        // Página principal
                demo: resolve(__dirname, 'demo.html'),         // Página demo
                register: resolve(__dirname, 'auth/register.html'), // Registro
                login: resolve(__dirname, 'auth/login.html')   // Login
            }
        }
    }
})