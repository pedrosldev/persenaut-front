const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
console.log("API Endpoint:", API_ENDPOINT);

// Referencias DOM (mantenemos las mismas)
const form = document.getElementById("retoForm");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const questionContent = document.getElementById("questionContent");
const generateBtn = document.getElementById("generateBtn");

// Manejar envío del formulario
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Mostrar loading
  loading.style.display = "block";
  result.style.display = "none";
  generateBtn.disabled = true;
  questionContent.innerHTML = "";

  try {
    // Cambiamos el payload para que coincida con lo que espera la nueva API
    const payload = {
      prompt: "Test" // Esto es lo que indica tu petición curl
      // Si necesitas enviar más datos, los añadirías aquí
    };

    // Petición a la API (similar a tu curl)
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Aquí puedes añadir otros headers si son necesarios
      },
      body: JSON.stringify(payload),
    });

    // Verificar respuesta
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en el servidor");
    }

    const data = await response.json();

    // Mostrar resultado (ajusta según la estructura de respuesta de la nueva API)
    showResult(data);
  } catch (error) {
    console.error("Error completo:", error);
    showError(error.message);
  } finally {
    loading.style.display = "none";
    generateBtn.disabled = false;
  }
});

// Ajusta estas funciones según el formato de respuesta de la nueva API
function showResult(data) {
  result.className = "result";
  result.style.display = "block";

  // Asume que la respuesta viene en data.response o similar
  // Ajusta según la estructura real de la respuesta
  questionContent.innerHTML = formatResponse(data);
}

function formatResponse(responseData) {
  // Aquí debes adaptar el formateo según cómo venga la respuesta
  // Esto es un ejemplo genérico
  if (typeof responseData === 'object') {
    return JSON.stringify(responseData, null, 2);
  }
  return responseData;
}

function showError(message) {
  result.className = "result error";
  result.style.display = "block";
  questionContent.innerHTML = `
    <p>❌ <strong>Error:</strong> ${message}</p>
    <p>Intenta recargar la página o vuelve a intentarlo más tarde.</p>
  `;
}