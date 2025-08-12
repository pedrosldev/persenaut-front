const form = document.getElementById('loginForm');
const API_URL_LOGIN = import.meta.env.VITE_LOGIN_API;
const API_URL_LOGOUT = import.meta.env.VITE_LOGOUT_API || `${API_URL_LOGIN.replace('/login', '/logout')}`;

function checkAuthState() {
    // Verificar si hay un token en localStorage (solo para transición)
    // const hasToken = localStorage.getItem('token') || document.cookie.includes('token');
    logoutBtn.style.display = hasToken ? 'block' : 'none';
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
checkAuthState();