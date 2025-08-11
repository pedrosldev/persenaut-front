const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Aquí iría la llamada fetch para autenticar al usuario en backend
    alert('Formulario válido. Aquí conectas con backend para login.');
});
