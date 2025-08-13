const API_URL_CHECK_AUTH = import.meta.env.VITE_CHECK_AUTH_API || `${API_URL_LOGIN.replace('/login', '/check-auth')}`;

async function checkAuthState() {
    try {
        const res = await fetch(API_URL_CHECK_AUTH, {
            method: 'GET',
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            // Asume que el endpoint devuelve { isAuthenticated: true/false }
            if (!data.isAuthenticated) {
                window.location.href = '/auth/login.html';
            }
        } else {
            window.location.href = '/auth/login.html';
        }
    } catch (error) {
        console.error("Error verificando autenticación:", error);
        window.location.href = '/auth/login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
});