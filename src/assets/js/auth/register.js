const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Registro correcto! Ya puedes iniciar sesión.');
            form.reset();
            // Opcional: redirigir a login.html
            // window.location.href = '/login.html';
        } else {
            alert('Error: ' + (data.error || 'No se pudo registrar'));
        }
    } catch (error) {
        alert('Error conectando con el servidor');
        console.error(error);
    }
});
