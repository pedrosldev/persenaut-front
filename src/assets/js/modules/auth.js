// auth.js - Módulo común para gestión de autenticación

export class AuthService {
    constructor() {
        this.API_URL_LOGIN = import.meta.env.VITE_LOGIN_API;
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

    // Para páginas protegidas - redirige si no está autenticado
    async requireAuth(redirectUrl = '/auth/login.html') {
        const result = await this.checkAuth();

        if (!result.isAuthenticated) {
            window.location.href = redirectUrl;
            return false;
        }

        return true;
    }

    // Para gestión de UI - actualiza elementos según estado de auth
    // async updateAuthUI(config = {}) {
    //     const {
    //         logoutBtn,
    //         loginBtn,
    //         userInfo,
    //         onAuthenticated,
    //         onNotAuthenticated
    //     } = config;

    //     const result = await this.checkAuth();

    //     if (result.isAuthenticated) {
    //         // Usuario autenticado
    //         if (logoutBtn) logoutBtn.style.display = 'block';
    //         if (loginBtn) loginBtn.style.display = 'none';
    //         if (userInfo) userInfo.style.display = 'block';
    //         if (onAuthenticated) onAuthenticated(result);
    //     } else {
    //         // Usuario no autenticado
    //         if (logoutBtn) logoutBtn.style.display = 'none';
    //         if (loginBtn) loginBtn.style.display = 'block';
    //         if (userInfo) userInfo.style.display = 'none';
    //         if (onNotAuthenticated) onNotAuthenticated(result);
    //     }

    //     return result;
    // }

    // auth.js - Modifica el método checkAuth
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
                    user: data.user // Añade esta línea para pasar los datos del usuario
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

    // Y actualiza updateAuthUI para recibir los datos del usuario
    async updateAuthUI(config = {}) {
        const {
            logoutBtn,
            loginBtn,
            userInfo,
            onAuthenticated,
            onNotAuthenticated
        } = config;

        const result = await this.checkAuth();

        if (result.isAuthenticated) {
            // Usuario autenticado
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'block';
                // Mostrar información del usuario si está disponible
                if (result.user) {
                    userInfo.textContent = `Bienvenido, ${result.user.name}`;
                }
            }
            if (onAuthenticated) onAuthenticated(result);
        } else {
            // Usuario no autenticado
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            if (onNotAuthenticated) onNotAuthenticated(result);
        }

        return result;
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
}

// Instancia singleton
export const authService = new AuthService();