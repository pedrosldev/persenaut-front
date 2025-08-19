// En templates.js o dashboard.js
document.addEventListener('click', function (event) {
    // Verificar si el click fue en el botón de reto
    if (event.target.id === 'template-reto') {

        event.preventDefault();
        alert("Crear nuevo reto");
        // Tu lógica aquí
    }
});