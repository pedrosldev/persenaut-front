// src/services/authService.js
import { httpClient } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

/**
 * Servicio de autenticación
 * Maneja login, registro, logout y verificación de autenticación
 */
export class AuthService {
    /**
     * Verificar autenticación actual
     * @returns {Promise<{success: boolean, isAuthenticated: boolean, user?: object}>}
     */
    async checkAuth() {
        try {
            const data = await httpClient.get(API_CONFIG.auth.checkAuth);
            return {
                success: true,
                isAuthenticated: data.isAuthenticated,
                user: data.user || null,
            };
        } catch (error) {
            console.error("Error verificando autenticación:", error);
            return {
                success: false,
                isAuthenticated: false,
                error,
            };
        }
    }

    /**
     * Proteger rutas - Redirige si no está autenticado
     * @param {Function} navigate - Función de navegación de React Router
     * @param {string} redirectUrl - URL de redirección (default: /login)
     * @returns {Promise<boolean>}
     */
    async requireAuth(navigate, redirectUrl = '/login') {
        const result = await this.checkAuth();

        if (!result.isAuthenticated) {
            if (navigate) {
                navigate(redirectUrl);
            } else {
                window.location.href = redirectUrl;
            }
            return false;
        }

        return true;
    }

    /**
     * Login de usuario
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{success: boolean, data?: object, error?: string}>}
     */
    async login(email, password) {
        try {
            const data = await httpClient.post(API_CONFIG.auth.login, { email, password });
            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Credenciales inválidas',
            };
        }
    }

    /**
     * Registro de usuario
     * @param {object} userData - Datos del usuario
     * @returns {Promise<{success: boolean, data?: object, error?: string}>}
     */
    async register(userData) {
        try {
            const data = await httpClient.post(API_CONFIG.auth.register, userData);
            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error en el registro',
            };
        }
    }

    /**
     * Logout de usuario
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async logout() {
        try {
            await httpClient.post(API_CONFIG.auth.logout);
            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al cerrar sesión',
            };
        }
    }

    /**
     * Actualizar UI con estado de autenticación (para React)
     * @param {object} callbacks - {onAuthenticated, onNotAuthenticated}
     * @returns {Promise<object>}
     */
    async updateAuthUI(callbacks = {}) {
        const { onAuthenticated, onNotAuthenticated } = callbacks;
        const result = await this.checkAuth();

        if (result.isAuthenticated) {
            if (onAuthenticated) onAuthenticated(result);
        } else {
            if (onNotAuthenticated) onNotAuthenticated(result);
        }

        return result;
    }
}

// Instancia singleton
export const authService = new AuthService();