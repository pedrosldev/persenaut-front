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
    const formattedQuestion = formatQuestion(responseText);

    updateHistory(theme, responseText);
    showResult(formattedQuestion);

  } catch (error) {
    showError(error);
  } finally {
    setLoading(false);
  }
});

// ========== FUNCIONES AUXILIARES ========== //

function setLoading(isLoading) {
  loading.style.display = isLoading ? "block" : "none";
  result.style.display = "none";
  generateBtn.disabled = isLoading;
  questionContent.innerHTML = "";
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
  return data.response || data.choices?.[0]?.message?.content || "";
}

function formatQuestion(rawText) {
  if (!rawText) {
    return "No se pudo generar la pregunta. Intenta con otro tema o nivel.";
  }

  try {
    return String(rawText)
      .trim()
      .replace(/Respuesta correcta:\s*([ABCD])/gi, '<strong>Respuesta correcta: $1</strong>')
      .replace(/\n/g, '<br>');
  } catch (error) {
    console.error("Error formateando pregunta:", error);
    return rawText;
  }
}

function updateHistory(theme, question) {
  if (!question) return;
  const history = questionHistory.get(theme) || [];
  questionHistory.set(theme, [...history, question.substring(0, 200)]); // Almacenar fragmento
}

function showResult(content) {
  result.className = "result success";
  result.style.display = "block";
  questionContent.innerHTML = `
    <div class="question-card">
      <div class="question-content">${content}</div>
      <button class="btn" id="newChallenge">Generar nuevo reto</button>
    </div>
  `;

  // Evento para nuevo reto
  document.getElementById("newChallenge")?.addEventListener("click", () => {
    form.dispatchEvent(new Event("submit"));
  });
}

function showError(error) {
  const message = error instanceof Error ? error.message : String(error);
  result.className = "result error";
  result.style.display = "block";
  questionContent.innerHTML = `
    <div class="error-card">
      <h4>⚠️ Error</h4>
      <p>${escapeHtml(message)}</p>
      <div class="error-actions">
        <button class="btn" onclick="window.location.reload()">Recargar</button>
        <button class="btn" id="retryButton">Reintentar</button>
      </div>
    </div>
  `;

  document.getElementById("retryButton")?.addEventListener("click", () => {
    form.dispatchEvent(new Event("submit"));
  });
}

function escapeHtml(unsafe) {
  return unsafe?.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;") || "";
}