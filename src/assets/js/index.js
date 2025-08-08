const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const questionHistory = new Map(); // Para evitar repeticiones

// Referencias DOM
const form = document.getElementById("retoForm");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const questionContent = document.getElementById("questionContent");
const generateBtn = document.getElementById("generateBtn");

// Manejar envío del formulario
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  setLoading(true);

  try {
    const { theme, level } = getFormData();
    const previousQuestions = questionHistory.get(theme) || [];
    const prompt = generatePrompt(theme, level, previousQuestions);

    const responseText = await fetchChallenge(prompt);

    updateHistory(theme, responseText);
    showResult(responseText); // Pasar texto sin formatear

  } catch (error) {
    showError(error);
  } finally {
    setLoading(false);
  }
});

// ========== FUNCIONES AUXILIARES ========== //

function setLoading(isLoading) {
  console.log("setLoading llamado con:", isLoading);
  loading.style.display = isLoading ? "block" : "none";

  if (isLoading) {
    result.style.display = "none";
    questionContent.innerHTML = "";
  }
  // NO ocultar result cuando isLoading = false, ya que showResult se encarga de eso

  generateBtn.disabled = isLoading;
}

function getFormData() {
  const formData = new FormData(form);
  const theme = formData.get("tematica")?.toString().trim();
  const level = formData.get("nivel")?.toString().trim();

  if (!theme || !level) {
    throw new Error("Por favor completa todos los campos");
  }
  return { theme, level };
}

function generatePrompt(theme, level, previousQuestions = []) {
  const avoidRepetition = previousQuestions.length > 0
    ? `\n\nPreguntas anteriores a evitar:\n${previousQuestions.slice(-3).join('\n')}`
    : '';

  return `Como experto en ${theme}, genera una pregunta test única (nivel ${level}) con:
- 1 pregunta clara
- 4 opciones (A, B, C, D)
- Respuesta correcta marcada
${avoidRepetition}

Formato requerido:
Pregunta: ¿...?
A) Opción A
B) Opción B
C) Opción C
D) Opción D
Respuesta correcta: [LETRA]`;
}

async function fetchChallenge(prompt) {
  const payload = {
    prompt,
    model: "phi3:mini",
    stream: false,
    options: { temperature: 0.7, top_p: 0.9 }
  };

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const data = await response.json();
  console.log("Respuesta de Ollama:", data);

  // Extrae el texto de respuesta según la estructura de Ollama
  const responseText = data.reto || data.response || data.message?.content || data.choices?.[0]?.message?.content || "";
  console.log("Texto extraído:", responseText); // Debug adicional

  return responseText;
}

function formatQuestion(rawText) {
  if (!rawText || rawText.trim() === '') {
    console.log("No hay texto para formatear:", rawText);
    return "No se recibió respuesta del servidor";
  }

  try {
    // Limpiar formato Markdown básico si existe
    let question = String(rawText)
      .replace(/\*\*/g, '') // Elimina negritas Markdown
      .replace(/\n/g, '<br>')
      .trim();

    // Destacar respuesta correcta si existe
    question = question.replace(
      /Respuesta correcta:\s*([ABCD])/gi,
      '<div class="correct-answer">✅ Respuesta correcta: <strong>$1</strong></div>'
    );

    console.log("Pregunta formateada:", question); // Debug adicional
    return question;
  } catch (error) {
    console.error("Error formateando:", error);
    return rawText || "Error al formatear la pregunta";
  }
}

function updateHistory(theme, question) {
  if (!question) return;
  const history = questionHistory.get(theme) || [];
  questionHistory.set(theme, [...history, question.substring(0, 200)]); // Almacenar fragmento
}

function showResult(rawContent) {
  console.log("Mostrando resultado con contenido:", rawContent); // Debug

  const formattedContent = formatQuestion(rawContent);
  console.log("Contenido formateado final:", formattedContent);

  // Asegurar que los elementos existan
  if (!result || !questionContent) {
    console.error("Elementos DOM no encontrados:", { result, questionContent });
    return;
  }

  result.className = "result success";
  result.style.display = "block";

  // Crear el HTML de forma más simple primero
  const htmlContent = `
    <div class="question-card">
      <div class="question-content">${formattedContent}</div>
      <div class="question-meta">
        <button type="button" class="btn" id="newChallenge">🔄 Generar nuevo reto</button>
      </div>
    </div>
  `;

  console.log("HTML a insertar:", htmlContent);
  questionContent.innerHTML = htmlContent;

  // Verificar que se insertó correctamente
  console.log("Contenido del questionContent después de insertar:", questionContent.innerHTML);
  console.log("Display del result:", window.getComputedStyle(result).display);

  // Agregar event listener al botón
  setTimeout(() => {
    const newChallengeBtn = document.getElementById("newChallenge");
    if (newChallengeBtn) {
      newChallengeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Generando nuevo reto..."); // Debug
        form.dispatchEvent(new Event("submit"));
      });
    } else {
      console.error("Botón newChallenge no encontrado");
    }
  }, 100);
}

function showError(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Mostrando error:", message); // Debug

  result.className = "result error";
  result.style.display = "block";
  questionContent.innerHTML = `
    <div class="error-card">
      <h4>⚠️ Error</h4>
      <p>${escapeHtml(message)}</p>
      <div class="error-actions">
        <button type="button" class="btn" onclick="window.location.reload()">🔄 Recargar</button>
        <button type="button" class="btn" id="retryButton">🔁 Reintentar</button>
      </div>
    </div>
  `;

  const retryBtn = document.getElementById("retryButton");
  if (retryBtn) {
    retryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    });
  }
}

function escapeHtml(unsafe) {
  return unsafe?.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;") || "";
}