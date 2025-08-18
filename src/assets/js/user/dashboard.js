// protected-page.js - Para páginas como dashboard que requieren autenticación
import { authService } from '../modules/auth.js';
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', async () => {
    const result = await authService.logout();

    if (result.success) {
        // alert('Sesión cerrada correctamente');
        window.location.href = '/auth/login.html';
        window.location.reload(true);
        // updateAuthState();
    } else {
        alert(result.error);
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación y redirigir si es necesario
    const isAuthenticated = await authService.requireAuth();

    if (isAuthenticated) {
        // Actualizar la UI con la info del usuario
        await authService.updateAuthUI({
            userInfo: document.getElementById('user-info'),
            // Puedes añadir más configuraciones aquí si necesitas
        });

        // Inicializar el resto de la página...
        initializePage();
    }

    
    const phrases = [
        "Sin lucha no hay progreso (Frederick Douglas).",
        "Inténtalo y fracasa, pero no fracases en intentarlo (Stephen Kaggwa).",
        "El trabajo duro vence al talento cuando el talento no trabaja duro (Tim Notke).",
        "Las cosas difíciles requieren un largo tiempo, las cosas imposibles un poco más (André A. Jackson).",
        "La única forma de hacer un gran trabajo es amar lo que haces (Steve Jobs).",
        "Una persona exitosa es aquella que es capaz de asentar una base con los ladrillos que otros le han tirado (David Brinkley).",
        "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito. Si amas lo que haces, tendrás éxito (Albert Schweitzer).",
        "La perseverancia es la clave del éxito (Charles Chaplin).",
        "La única lucha que se pierde es la que se abandona (Che Guevara).",
        "No estoy desanimado porque cada intento equivocado descartado es un paso adelante (Thomas Edison).",
        "La perseverancia es el trabajo duro que haces después de cansarte del trabajo duro que ya hiciste (Newt Gingrich).",
        "La perseverancia es la base de todas las acciones (Lao Tzu).",
        "Las grandes obras no son llevadas a cabo por la fuerza, sino por la perseverancia (Samuel Johnson).",
        "No importa lo lento que vayas mientras no pares (Andy Warhol).",
        "La perseverancia es fallar 19 veces y triunfar la vigésima (Julie Andrews).",
        "Confía en el tiempo, que suele dar dulces salidas a muchas amargas dificultades. (Miguel de Cervantes).",
        "La perseverancia es imposible si no nos permitimos tener esperanza (Dean Koontz).",
        "Siempre parece imposible hasta que se hace (Nelson Mandela)",
        "La perseverancia no es una carrera larga, son muchas carreras cortas una tras otra (Walter Elliot).",
        "El genio se compone del 2% de talento y del 98% de perseverancia (Beethoven).",
        "El éxito es la suma de pequeños esfuerzos repetidos día tras día (Robert Collier).",
        "La motivación es lo que te pone en marcha. El hábito es lo que hace que sigas (Jim Ryun).",
        "Paso a paso. No concibo ninguna otra manera de lograr las cosas (Michael Jordan)."
    ];

    const phraseElement = document.getElementById('motivational-phrase');

    let currentIndex = 0;

    function showNextPhrase() {
        // Alternar visibilidad con fade
        phraseElement.classList.remove('show');

        setTimeout(() => {
            // Cambiar la frase
            currentIndex = (currentIndex + 1) % phrases.length;
            phraseElement.textContent = phrases[currentIndex];
            phraseElement.classList.add('show');
        }, 1500); // Esperar 1.5s para el fade-out
    }

    // Mostrar la primera frase al cargar
    phraseElement.textContent = phrases[currentIndex];
    phraseElement.classList.add('show');

    // Cambiar frase cada 4 segundos (ajustable)
    setInterval(showNextPhrase, 4000);
});

function initializePage() {
    // Lógica específica de la página protegida
    console.log('Usuario autenticado, inicializando página...');
}