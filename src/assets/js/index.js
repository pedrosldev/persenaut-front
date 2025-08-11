const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const GROQ_API = import.meta.env.VITE_GROQ_API;

const questionHistory = new Map();


const form = document.getElementById("retoForm");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const questionContent = document.getElementById("questionContent");
const generateBtn = document.getElementById("generateBtn");


form.addEventListener("submit", async function (e) {
  e.preventDefault();
  setLoading(true);

  try {
    const { theme, level } = getFormData();
    const previousQuestions = questionHistory.get(theme) || [];
    const prompt = generatePrompt(theme, level, previousQuestions);

    const responseText = await fetchChallenge(prompt);

    updateHistory(theme, responseText);
    showResult(responseText);

  } catch (error) {
    showError(error);
  } finally {
    setLoading(false);
  }
});



function setLoading(isLoading) {
  console.log("setLoading llamado con:", isLoading);
  loading.style.display = isLoading ? "block" : "none";

  if (isLoading) {
    result.style.display = "none";
    questionContent.innerHTML = "";
  }


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
  const avoidRepetition = previousQuestions.length > 0 ?
    `\n\nPREGUNTAS RECIENTES A EVITAR:\n${previousQuestions.slice(-3).join('\n')}\n` : '';

  return `ERES UN EXAMINADOR PROFESIONAL. GENERA EXCLUSIVAMENTE PREGUNTAS TIPO TEST CON 4 OPCIONES (A-D) Y 1 RESPUESTA CORRECTA.

TEMA: ${theme}
NIVEL: ${level}
${avoidRepetition}

FORMATO OBLIGATORIO (COPIA ESTA ESTRUCTURA):

Pregunta: [Tu pregunta aquí]

A) [Opción A]
B) [Opción B]
C) [Opción C]
D) [Opción D]

Respuesta correcta: [Letra]

REGLAS ABSOLUTAS:
1. ¡NUNCA omitas las opciones A-D!
2. ¡Siempre incluye "Respuesta correcta:"!
3. ¡Solo 4 opciones exactamente!
4. ¡No añadas explicaciones adicionales!
5. ¡Mantén el formato línea por línea!

EJEMPLO VÁLIDO:
Pregunta: ¿Qué comando muestra el espacio en disco en Linux?

A) df -h
B) ls -l
C) cat /proc/meminfo
D) netstat -tuln

Respuesta correcta: A`;
}

async function fetchChallenge(prompt) {
  const payload = {
    prompt,
    model: "mistral",
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


  const responseText = data.reto || data.response || data.message?.content || data.choices?.[0]?.message?.content || "";
  console.log("Texto extraído:", responseText); // Debug adicional

  return responseText;
}

function formatQuestion(rawText) {
  if (!rawText || rawText.trim() === '') {
    return "No se recibió respuesta del servidor";
  }

  try {

    let question = String(rawText)
      .replace(/\r\n/g, '\n')  // Normalizar saltos de línea
      .replace(/\*\*/g, '')    // Eliminar negritas
      .replace(/\*/g, '')       // Eliminar cursivas
      .trim();


    let correctAnswer = null;
    const answerMatch = question.match(/Respuesta correcta:\s*([ABCD])/i) ||
      question.match(/Correcta:\s*([ABCD])/i) ||
      question.match(/La respuesta correcta es\s*([ABCD])/i);

    if (answerMatch) {
      correctAnswer = answerMatch[1].toUpperCase();

      question = question.replace(/Respuesta correcta:\s*([ABCD]).*/i, '').trim();
    }


    const questionParts = question.split(/\n\s*\n/); // Dividir por doble salto de línea
    let questionText = questionParts[0] || "Pregunta no encontrada";
    let optionsText = questionParts.slice(1).join('\n') || "";


    questionText = questionText.replace(/^Pregunta:\s*/i, '').trim();


    const options = [];
    const optionRegex = /^([ABCD])[\)\.]\s*(.+)$/gm;
    let optionMatch;

    while ((optionMatch = optionRegex.exec(optionsText)) !== null) {
      options.push({
        letter: optionMatch[1],
        text: optionMatch[2].trim()
      });
    }


    if (options.length === 0) {
      const lines = optionsText.split('\n').filter(line => line.trim().length > 0);
      lines.forEach((line, index) => {
        if (index < 4) { // Solo las primeras 4 líneas como opciones
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          options.push({
            letter: letter,
            text: line.trim().replace(/^[ABCD][\)\.]\s*/, '')
          });
        }
      });
    }


    let html = `
      <div class="question-title"><strong>Pregunta:</strong> ${escapeHtml(questionText)}</div>
      <div class="question-options">
    `;

    options.forEach(option => {
      html += `
        <div class="question-option" data-option="${option.letter}">
          <strong>${option.letter})</strong> ${escapeHtml(option.text)}
        </div>
      `;
    });

    html += `</div>`;


    if (correctAnswer) {
      html += `
        <div class="answer-controls">
          <button type="button" class="btn show-answer-btn">🔍 Mostrar respuesta</button>
        </div>
        <div class="answer-section" style="display:none;">
          <div class="correct-answer">✅ <strong>Respuesta correcta: ${correctAnswer}</strong></div>
        </div>
      `;
    }

    return html;

  } catch (error) {
    console.error("Error formateando pregunta:", error);
    return `<div class="question-error">${escapeHtml(rawText)}</div>`;
  }
}


function fixTrueFalseFormat(text) {

  const questionMatch = text.match(/^(.*?)(?=Verdadero|A\)|Respuesta)/i);
  const baseQuestion = questionMatch ? questionMatch[1].trim() : 'Pregunta:';


  const isCorrectTrue = text.toLowerCase().includes('verdadero') &&
    (text.toLowerCase().includes('correcta: a') ||
      text.toLowerCase().includes('verdadero (a)'));


  const explanationMatch = text.match(/explicación:\s*(.*?)$/i);
  const explanation = explanationMatch ? `\nExplicación: ${explanationMatch[1]}` : '';

  return `${baseQuestion}

A) Verdadero
B) Falso

Respuesta correcta: ${isCorrectTrue ? 'A' : 'B'}${explanation}`;
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


  if (!result || !questionContent) {
    console.error("Elementos DOM no encontrados:", { result, questionContent });
    return;
  }

  result.className = "result success";
  result.style.display = "block";


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


  console.log("Contenido del questionContent después de insertar:", questionContent.innerHTML);
  console.log("Display del result:", window.getComputedStyle(result).display);


  setTimeout(() => {

    const newChallengeBtn = document.getElementById("newChallenge");
    if (newChallengeBtn) {
      newChallengeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Generando nuevo reto..."); // Debug
        form.dispatchEvent(new Event("submit"));
      });
    }


    const showAnswerBtn = document.querySelector(".show-answer-btn");
    const answerSection = document.querySelector(".answer-section");

    if (showAnswerBtn && answerSection) {
      showAnswerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Mostrando respuesta...");


        answerSection.style.display = "block";


        showAnswerBtn.textContent = "✅ Respuesta mostrada";
        showAnswerBtn.disabled = true;
        showAnswerBtn.style.opacity = "0.6";


        const correctOption = answerSection.querySelector('.correct-answer').textContent.match(/([ABCD])/);
        if (correctOption) {
          const correctLetter = correctOption[1];
          const optionElement = document.querySelector(`[data-option="${correctLetter})"]`);
          if (optionElement) {
            optionElement.classList.add('correct-option');
          }
        }
      });
    }


    const options = document.querySelectorAll('.question-option');
    options.forEach(option => {
      option.addEventListener('click', () => {

        options.forEach(opt => opt.classList.remove('selected'));

        option.classList.add('selected');
      });
    });

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


const testBtn = document.getElementById('testGroqBtn');
const testResult = document.getElementById('testResult');


async function testGroq(prompt) {
  try {
    const res = await fetch(GROQ_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error en la API Groq');
    }

    const data = await res.json();
    console.log("Respuesta Groq:", data.response);
    return data.response;
  } catch (err) {
    console.error(err);
    return null;
  }
}



testBtn.addEventListener('click', async () => {
  testBtn.disabled = true;
  testResult.style.display = 'none';
  testResult.innerHTML = '';

  try {

    const { theme, level } = getFormData();
    const prompt = generatePrompt(theme, level);


    const responseText = await testGroq(prompt);


    const html = formatQuestion(responseText);
    testResult.innerHTML = `
  <div class="question-card">
    <div class="question-content">${html}</div>
  </div>
`;
    testResult.style.display = 'block';


    const showAnswerBtn = testResult.querySelector(".show-answer-btn");
    const answerSection = testResult.querySelector(".answer-section");

    if (showAnswerBtn && answerSection) {
      showAnswerBtn.addEventListener("click", () => {
        answerSection.style.display = "block"; // muestra la respuesta
        showAnswerBtn.textContent = "✅ Respuesta mostrada";
        showAnswerBtn.disabled = true;


        const correctLetterMatch = answerSection.textContent.match(/Respuesta correcta:\s*([ABCD])/i);
        if (correctLetterMatch) {
          const letter = correctLetterMatch[1];
          const optionElement = testResult.querySelector(`[data-option="${letter}"]`);
          if (optionElement) optionElement.classList.add("correct-option");
        }
      });
    }


    const options = testResult.querySelectorAll(".question-option");
    options.forEach(option => {
      option.addEventListener("click", () => {
        options.forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");
      });
    });

  } catch (e) {
    testResult.innerHTML = `<div class="error-card">⚠️ Error: ${e.message}</div>`;
    testResult.style.display = 'block';
  } finally {
    testBtn.disabled = false;
  }
});
