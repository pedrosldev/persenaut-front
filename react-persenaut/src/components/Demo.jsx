import React, { useState } from 'react';
import styles from './Demo.module.css';

const Demo = () => {
  // URLs de API por defecto para el entorno de prueba
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const GROQ_API = import.meta.env.VITE_GROQ_API;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ tematica: '', nivel: '' });
  const [result, setResult] = useState({ show: false, content: '', isError: false, showAnswer: false, selectedOption: null });
  const [testResult, setTestResult] = useState({ show: false, content: '', showAnswer: false, selectedOption: null });
  const [questionHistory] = useState(new Map());

  const generatePrompt = (theme, level, previousQuestions = []) => {
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
5. ¡Mantén el formato línea por línea!`;
  };

  const fetchChallenge = async (prompt) => {
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
    return data.reto || data.response || data.message?.content || data.choices?.[0]?.message?.content || "";
  };

  const testGroq = async (prompt) => {
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
      return data.response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const formatQuestion = (rawText) => {
    if (!rawText || rawText.trim() === '') {
      return { questionText: "No se recibió respuesta del servidor", options: [], correctAnswer: null };
    }

    try {
      let question = String(rawText)
        .replace(/\r\n/g, '\n')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

      let correctAnswer = null;
        const answerMatch =
          question.match(/Respuesta correcta:\s*([ABCD])/i) ||
          question.match(/Correcta:\s*([ABCD])/i) ||
          question.match(/La respuesta correcta es\s*([ABCD])/i);

      if (answerMatch) {
        correctAnswer = answerMatch[1].toUpperCase();
         question = question
           .replace(/Respuesta correcta:\s*[ABCD].*/i, "")
           .trim();
      }

      const questionParts = question.split(/\n\s*\n/);
      let questionText = questionParts[0] || "Pregunta no encontrada";
      let optionsText = questionParts.slice(1).join('\n') || "";

      questionText = questionText.replace(/^Pregunta:\s*/i, '').trim();

      const options = [];
      const optionRegex = /^([ABCD])[).]\s*(.+)$/gim;
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
          if (index < 4) {
            const letter = String.fromCharCode(65 + index);
            options.push({
              letter: letter,
              text: line.trim().replace(/^[ABCD][).]\s*/, "")
            });
          }
        });
      }

      return { questionText, options, correctAnswer, rawText };

    } catch (error) {
      console.error("Error formateando pregunta:", error);
      return { questionText: rawText, options: [], correctAnswer: null };
    }
  };

  const updateHistory = (theme, question) => {
    if (!question) return;
    const history = questionHistory.get(theme) || [];
    questionHistory.set(theme, [...history, question.substring(0, 200)]);
  };

  const handleSubmit = async () => {
    if (!formData.tematica || !formData.nivel) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setResult({ show: false, content: '', isError: false, showAnswer: false, selectedOption: null });

    try {
      const previousQuestions = questionHistory.get(formData.tematica) || [];
      const prompt = generatePrompt(formData.tematica, formData.nivel, previousQuestions);
      const responseText = await fetchChallenge(prompt);
      
      updateHistory(formData.tematica, responseText);
      const formatted = formatQuestion(responseText);
      
      setResult({
        show: true,
        content: formatted,
        isError: false,
        showAnswer: false,
        selectedOption: null
      });

    } catch (error) {
      setResult({
        show: true,
        content: { error: error.message },
        isError: true,
        showAnswer: false,
        selectedOption: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestGroq = async () => {
    setLoading(true);
    setTestResult({ show: false, content: '', showAnswer: false, selectedOption: null });

    try {
      const theme = formData.tematica || 'Test general';
      const level = formData.nivel || 'intermedio';
      const prompt = generatePrompt(theme, level);
      
      const responseText = await testGroq(prompt);
      const formatted = formatQuestion(responseText);
      
      setTestResult({
        show: true,
        content: formatted,
        showAnswer: false,
        selectedOption: null
      });

    } catch (error) {
      setTestResult({
        show: true,
        content: { error: error.message },
        showAnswer: false,
        selectedOption: null
      });
    } finally {
      setLoading(false);
    }
  };

  const QuestionDisplay = ({ data, onShowAnswer, showAnswer, selectedOption, onSelectOption }) => {
    if (data.error) {
      return (
        <div className={`${styles.result} ${styles.resultError}`}>
          <h4>⚠️ Error</h4>
          <p>{data.error}</p>
        </div>
      );
    }

    return (
      <div>
        <div className={styles.questionTitle}>
          <strong>Pregunta:</strong> {data.questionText}
        </div>
        <div className={styles.questionOptions}>
          {data.options.map(option => (
            <div
              key={option.letter}
              className={`${styles.questionOption} ${
                selectedOption === option.letter ? styles.selected : ''
              } ${
                showAnswer && data.correctAnswer === option.letter ? styles.correct : ''
              }`}
              onClick={() => onSelectOption(option.letter)}
            >
              <strong>{option.letter})</strong> {option.text}
            </div>
          ))}
        </div>
        
        {data.correctAnswer && !showAnswer && (
          <div className={styles.answerControls}>
            <button 
              className={styles.showAnswerBtn}
              onClick={onShowAnswer}
            >
              🔍 Mostrar respuesta
            </button>
          </div>
        )}
        
        {showAnswer && data.correctAnswer && (
          <div className={styles.correctAnswer}>
            ✅ <strong>Respuesta correcta: {data.correctAnswer}</strong>
          </div>
        )}
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <h1>📝 PERSENAUT</h1>
      
      <div className={styles.demoBanner}>
        <p>🔐 Esta es una versión demo. <a href="auth/register.html">Regístrate</a> para desbloquear:</p>
        <ul>
          <li>✔️ Historial de preguntas</li>
          <li>✔️ Guardar tus favoritas</li>
          <li>✔️ Automatización de la frecuencia de los retos</li>
        </ul>
      </div>

      <div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="tematica">Temática de la Pregunta:</label>
          <input
            className={styles.input}
            type="text"
            id="tematica"
            name="tematica"
            placeholder="ej: JavaScript, matemáticas, historia..."
            value={formData.tematica}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="nivel">Nivel de Dificultad:</label>
          <select 
            className={styles.select}
            id="nivel" 
            name="nivel" 
            value={formData.nivel}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona un nivel</option>
            <option value="principiante">🟢 Principiante</option>
            <option value="intermedio">🟡 Intermedio</option>
            <option value="avanzado">🔴 Avanzado</option>
          </select>
        </div>

        <button
          type="button"
          className={`${styles.btn} ${loading ? styles.btnDisabled : ''}`}
          disabled={loading}
          onClick={handleSubmit}
        >
          🚀 Generar Pregunta
        </button>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Generando tu pregunta personalizada...</p>
        </div>
      )}

      {result.show && (
        <div className={`${styles.result} ${result.isError ? styles.resultError : ''}`}>
          {result.isError ? (
            <div>
              <h4>⚠️ Error</h4>
              <p>{result.content.error}</p>
            </div>
          ) : (
            <div>
              <h3>¡Tu pregunta está lista! 📝</h3>
              <div className={styles.questionContent}>
                <QuestionDisplay
                  data={result.content}
                  onShowAnswer={() => setResult(prev => ({...prev, showAnswer: true}))}
                  showAnswer={result.showAnswer}
                  selectedOption={result.selectedOption}
                  onSelectOption={(option) => setResult(prev => ({...prev, selectedOption: option}))}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className={`${styles.btn} ${loading ? styles.btnDisabled : ''}`}
        onClick={handleTestGroq}
        disabled={loading}
      >
        Test Groq API
      </button>

      {testResult.show && (
        <div className={styles.result}>
          <h3>Resultado Test Groq</h3>
          <div className={styles.questionContent}>
            <QuestionDisplay
              data={testResult.content}
              onShowAnswer={() => setTestResult(prev => ({...prev, showAnswer: true}))}
              showAnswer={testResult.showAnswer}
              selectedOption={testResult.selectedOption}
              onSelectOption={(option) => setTestResult(prev => ({...prev, selectedOption: option}))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;