const form = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const API_URL_LOGIN = import.meta.env.VITE_LOGIN_API;
const API_URL_LOGOUT = import.meta.env.VITE_LOGOUT_API || `${API_URL_LOGIN.replace('/login', '/logout')}`;
const API_URL_CHECK_AUTH = import.meta.env.VITE_CHECK_AUTH_API || `${API_URL_LOGIN.replace('/login', '/check-auth')}`;

// function checkAuthState() {

//     const hasToken = document.cookie.includes('token');
//     logoutBtn.style.display = hasToken ? 'block' : 'none';
// }

async function checkAuthState() {
    try {
        const res = await fetch(API_URL_CHECK_AUTH, {
            method: 'GET',
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            // Asume que el endpoint devuelve { isAuthenticated: true/false }
            logoutBtn.style.display = data.isAuthenticated ? 'block' : 'none';

            // Opcional: Redirigir si no está autenticado
            // if (!data.isAuthenticated && location.pathname !== '/login.html') {
            //     window.location.href = '/login.html';
            // }
        } else {
            logoutBtn.style.display = 'none';
        }
    } catch (error) {
        console.error("Error verificando autenticación:", error);
        logoutBtn.style.display = 'none';
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    try {
        const res = await fetch(API_URL_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
            // Guardar token en localStorage para usarlo después en rutas protegidas
            // localStorage.setItem('token', data.token);
            alert('Login correcto');
            form.reset();
            // Aquí puedes redirigir a una página privada, por ejemplo:
            // window.location.href = '/dashboard.html';
        } else {
            alert('Error: ' + (data.error || 'Credenciales inválidas'));
        }
    } catch (error) {
        alert('Error conectando con el servidor');
        console.error(error);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        const res = await fetch(API_URL_LOGOUT, {
            method: 'POST',
            credentials: 'include' // Para enviar cookies
        });

        if (res.ok) {
            // localStorage.removeItem('token'); // Limpiar por si acaso
            alert('Sesión cerrada correctamente');
            checkAuthState();
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        alert('Error conectando con el servidor');
        console.error(error);
    }
});

// Inicializar estado al cargar la página
document.addEventListener('DOMContentLoaded', checkAuthState);