const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // Guardar token en localStorage para usarlo después en rutas protegidas
            localStorage.setItem('token', data.token);
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
