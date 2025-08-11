const form = document.getElementById('registerForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Aquí iría la llamada fetch para registrar el usuario en backend
    alert('Formulario válido. Aquí conectas con backend para registro.');
});
