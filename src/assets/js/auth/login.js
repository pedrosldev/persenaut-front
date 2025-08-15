// login-page.js - Para la página de login
import { authService } from '../modules/auth.js';

const form = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// Manejar submit del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    const result = await authService.login(email, password);

    if (result.success) {
        alert('Login correcto');
        form.reset();
        window.location.href = '/app/dashboard.html';
    } else {
        alert('Error: ' + result.error);
    }
});

// Manejar logout
logoutBtn.addEventListener('click', async () => {
    const result = await authService.logout();

    if (result.success) {
        alert('Sesión cerrada correctamente');
        updateAuthState();
    } else {
        alert(result.error);
    }
});

// Función para actualizar el estado de la UI
async function updateAuthState() {
    await authService.updateAuthUI({
        logoutBtn: logoutBtn,
        onAuthenticated: (result) => {
            console.log('Usuario autenticado');
        },
        onNotAuthenticated: (result) => {
            console.log('Usuario no autenticado');
        }
    });
}

// Inicializar estado al cargar la página
document.addEventListener('DOMContentLoaded', updateAuthState);