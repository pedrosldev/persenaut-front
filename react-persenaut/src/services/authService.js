// src/services/authService.js
export class AuthService {
    constructor() {
        this.API_URL_LOGIN = import.meta.env.VITE_LOGIN_API;
        this.API_URL_REGISTER = import.meta.env.VITE_REGISTER_API || `${this.API_URL_LOGIN.replace('/login', '/register')}`;
        this.API_URL_LOGOUT = import.meta.env.VITE_LOGOUT_API || `${this.API_URL_LOGIN.replace('/login', '/logout')}`;
        this.API_URL_CHECK_AUTH = import.meta.env.VITE_CHECK_AUTH_API || `${this.API_URL_LOGIN.replace('/login', '/check-auth')}`;
    }

    // Método base para verificar autenticación
    async checkAuth() {
        try {
            const res = await fetch(this.API_URL_CHECK_AUTH, {
                method: 'GET',
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                return {
                    success: true,
                    isAuthenticated: data.isAuthenticated,
                    user: data.user || null
                };
            } else {
                return {
                    success: false,
                    isAuthenticated: false
                };
            }
        } catch (error) {
            console.error("Error verificando autenticación:", error);
            return {
                success: false,
                isAuthenticated: false,
                error
            };
        }
    }

    // Para páginas protegidas - ahora usa React Router
    async requireAuth(navigate, redirectUrl = '/login') {
        const result = await this.checkAuth();

        if (!result.isAuthenticated) {
            if (navigate) {
                navigate(redirectUrl);
            } else {
                // Fallback si no hay navigate disponible
                window.location.href = redirectUrl;
            }
            return false;
        }

        return true;
    }

    // Método para login
    async login(email, password) {
        try {
            const res = await fetch(this.API_URL_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                return {
                    success: true,
                    data
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Credenciales inválidas'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Error conectando con el servidor'
            };
        }
    }

    // Método para registro
    async register(userData) {
        try {
            const res = await fetch(this.API_URL_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                return {
                    success: true,
                    data
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Error en el registro'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Error conectando con el servidor'
            };
        }
    }

    // Método para logout
    async logout() {
        try {
            const res = await fetch(this.API_URL_LOGOUT, {
                method: 'POST',
                credentials: 'include'
            });

            return {
                success: res.ok,
                error: res.ok ? null : 'Error al cerrar sesión'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error conectando con el servidor'
            };
        }
    }

    // Para gestión de UI React - versión adaptada
    async updateAuthUI(callbacks = {}) {
        const {
            onAuthenticated,
            onNotAuthenticated
        } = callbacks;

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