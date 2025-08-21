import React, { useState } from 'react';
import styles from './Demo.module.css';

export default function Demo() {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const GROQ_API = import.meta.env.VITE_GROQ_API;

  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [questionHistory, setQuestionHistory] = useState(new Map());
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  const generatePrompt = (theme, level, previousQuestions = []) => {
    const avoidRepetition = previousQuestions.length > 0
      ? `\n\nPREGUNTAS RECIENTES A EVITAR:\n${previousQuestions.slice(-3).join('\n')}\n`
      : '';

    return `ERES UN EXAMINADOR PROFESIONAL. GENERA PREGUNTAS TIPO TEST CON 4 OPCIONES (A-D) Y 1 RESPUESTA CORRECTA.

TEMA: ${theme}
NIVEL: ${level}
${avoidRepetition}

FORMATO OBLIGATORIO:

Pregunta: [Tu pregunta aquí]

A) [Opción A]
B) [Opción B]
C) [Opción C]
D) [Opción D]

Respuesta correcta: [Letra]`;
  };

  const fetchChallenge = async (prompt) => {
    const payload = { prompt, model: "mistral", stream: false, options: { temperature: 0.7, top_p: 0.9 } };
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    const responseText = data.reto || data.response || '';
    console.log("Respuesta cruda de Ollama:", responseText);
    addLog("Ollama: " + responseText);
    return responseText;
  };

  const testGroq = async (prompt) => {
    try {
      const res = await fetch(GROQ_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Error ${res.status}`);
      }

      const data = await res.json();
      const text = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
      console.log("Respuesta Groq:", text);
      addLog("Groq: " + text);
      return text;
    } catch (err) {
      console.error("Error Groq:", err);
      addLog("Groq Error: " + err.message);
      return "No se pudo obtener respuesta de la API.";
    }
  };

  const formatQuestionFlexible = (rawText) => {
    if (!rawText || rawText.trim() === '') return { question: rawText || 'Sin respuesta', options: [], correct: null, rawText };

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let question = lines.find(l => l.toLowerCase().startsWith('pregunta:')) || lines[0] || "Pregunta no encontrada";

    const options = [];
    let correct = null;

    lines.forEach(l => {
      const match = l.match(/^([ABCD])[).]\s*(.+)$/);
      if (match) options.push({ letter: match[1], text: match[2] });
      const correctMatch = l.match(/respuesta correcta:\s*([ABCD])/i);
      if (correctMatch) correct = correctMatch[1];
    });

    return { question: question.replace(/^Pregunta:\s*/i, ''), options, correct, rawText };
  };

  const updateHistory = (theme, newQuestion) => {
    setQuestionHistory(prev => {
      const history = prev.get(theme) || [];
      const updated = new Map(prev);
      updated.set(theme, [...history, newQuestion.substring(0, 200)]);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestionData(null);
    setShowAnswer(false);
    setSelectedOption(null);

    const formData = new FormData(e.target);
    const theme = formData.get('tematica')?.trim();
    const level = formData.get('nivel')?.trim();

    if (!theme || !level) {
      alert('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const previousQuestions = questionHistory.get(theme) || [];
      const prompt = generatePrompt(theme, level, previousQuestions);
      const responseText = await fetchChallenge(prompt);
      updateHistory(theme, responseText);
      setQuestionData(formatQuestionFlexible(responseText));
    } catch (err) {
      console.error(err);
      alert('Error generando la pregunta: ' + err.message);
      addLog("Ollama Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestGroq = async () => {
    setLoading(true);
    setQuestionData(null);
    setShowAnswer(false);
    setSelectedOption(null);

    try {
      const themeInput = document.getElementById('tematica')?.value?.trim() || '';
      const levelInput = document.getElementById('nivel')?.value?.trim() || '';
      const prompt = generatePrompt(themeInput || 'Test', levelInput || 'intermedio');

      const responseText = await testGroq(prompt);
      setQuestionData(formatQuestionFlexible(responseText));
    } catch (err) {
      console.error(err);
      alert('Error en test Groq: ' + err.message);
      addLog("Groq Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>📝 PERSENAUT</h1>

      <form onSubmit={handleSubmit} className={styles.retoForm}>
        <div className={styles.formGroup}>
          <label htmlFor="tematica">Temática de la Pregunta:</label>
          <input type="text" id="tematica" name="tematica" placeholder="ej: JavaScript, matemáticas..." required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nivel">Nivel de Dificultad:</label>
          <select id="nivel" name="nivel" required>
            <option value="">Selecciona un nivel</option>
            <option value="principiante">🟢 Principiante</option>
            <option value="intermedio">🟡 Intermedio</option>
            <option value="avanzado">🔴 Avanzado</option>
          </select>
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Generando...' : '🚀 Generar Pregunta'}
        </button>

        <button type="button" className={styles.btn} onClick={handleTestGroq} disabled={loading}>
          {loading ? 'Cargando...' : '🧪 Test Groq'}
        </button>
      </form>

      {loading && <p>Cargando pregunta...</p>}

      {questionData && (
        <div className={styles.result}>
          <h3>¡Tu pregunta está lista! 📝</h3>
          <p className={styles.questionTitle}>{questionData.question}</p>
          <div className={styles.questionOptions}>
            {questionData.options.length > 0 ? questionData.options.map(opt => (
              <div
                key={opt.letter}
                className={`${styles.questionOption} ${selectedOption === opt.letter ? styles.selected : ''} ${showAnswer && questionData.correct === opt.letter ? styles.correctOption : ''}`}
                onClick={() => setSelectedOption(opt.letter)}
              >
                <strong>{opt.letter})</strong> {opt.text}
              </div>
            )) : <pre>{questionData.rawText}</pre>}
          </div>

          {questionData.correct && !showAnswer && (
            <button className={styles.btn} onClick={() => setShowAnswer(true)}>🔍 Mostrar respuesta</button>
          )}

          {showAnswer && questionData.correct && (
            <p className={styles.correctAnswer}>✅ Respuesta correcta: {questionData.correct}</p>
          )}

          <button className={styles.btn} onClick={handleSubmit}>🔄 Generar nuevo reto</button>
        </div>
      )}

      {/* Panel de logs */}
      <div className={styles.logsPanel} style={{ marginTop: '20px' }}>
        <h4>Logs de prueba:</h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#f4f4f4', padding: '10px' }}>
          {logs.map((log, i) => (
            <pre key={i} style={{ margin: 0 }}>{log}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}
