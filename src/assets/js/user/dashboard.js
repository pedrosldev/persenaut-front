// protected-page.js - Para páginas como dashboard que requieren autenticación
import { authService } from '../modules/auth.js';


// document.addEventListener('DOMContentLoaded', async () => {
//     // Verificar autenticación y redirigir si es necesario
//     await authService.requireAuth();

//     // Si llegamos aquí, el usuario está autenticado
//     // Inicializar el resto de la página...
//     initializePage();
// });

// function initializePage() {
//     // Lógica específica de la página protegida
//     console.log('Usuario autenticado, inicializando página...');
// }

/********************/ 



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
});

function initializePage() {
    // Lógica específica de la página protegida
    console.log('Usuario autenticado, inicializando página...');
}