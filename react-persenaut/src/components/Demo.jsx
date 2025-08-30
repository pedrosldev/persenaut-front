import React, { useState } from "react";
import styles from "./Demo.module.css";
import { generatePrompt, formatQuestion } from "../services/promptService";
import { fetchChallenge, testGroq, saveQuestionToDB } from "../services/apiService";
const Demo = () => {


  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ tematica: "", nivel: "" });
  const [result, setResult] = useState({
    show: false,
    content: "",
    isError: false,
    showAnswer: false,
    selectedOption: null,
  });
  const [testResult, setTestResult] = useState({
    show: false,
    content: "",
    showAnswer: false,
    selectedOption: null,
  });
  const [questionHistory] = useState(new Map());



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
    setResult({
      show: false,
      content: "",
      isError: false,
      showAnswer: false,
      selectedOption: null,
    });

    try {
      const previousQuestions = questionHistory.get(formData.tematica) || [];
      const prompt = generatePrompt(
        formData.tematica,
        formData.nivel,
        previousQuestions
      );
      const responseText = await fetchChallenge(prompt);

      updateHistory(formData.tematica, responseText);
      const formatted = formatQuestion(responseText);

      setResult({
        show: true,
        content: formatted,
        isError: false,
        showAnswer: false,
        selectedOption: null,
      });

      try {
        const saveResult = await saveQuestionToDB(
          formatted,
          formData.tematica,
          formData.nivel,
          responseText
        );
        console.log("Guardado exitoso:", saveResult);

        // Opcional: mostrar un toast o mensaje de que se guardó
        alert(`✅ Pregunta guardada en BD con ID: ${saveResult.id}`);
      } catch (saveError) {
        console.error(
          "Error al guardar (pero la pregunta se mostró):",
          saveError
        );
        // No mostramos error al usuario para no interrumpir la experiencia
      }
    } catch (error) {
      setResult({
        show: true,
        content: { error: error.message },
        isError: true,
        showAnswer: false,
        selectedOption: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestGroq = async () => {
    setLoading(true);
    setTestResult({
      show: false,
      content: "",
      showAnswer: false,
      selectedOption: null,
    });

    try {
      const theme = formData.tematica || "Test general";
      const level = formData.nivel || "intermedio";
      const prompt = generatePrompt(theme, level);

      const responseText = await testGroq(prompt);
      const formatted = formatQuestion(responseText);

      setTestResult({
        show: true,
        content: formatted,
        showAnswer: false,
        selectedOption: null,
      });
    } catch (error) {
      setTestResult({
        show: true,
        content: { error: error.message },
        showAnswer: false,
        selectedOption: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const QuestionDisplay = ({
    data,
    onShowAnswer,
    showAnswer,
    selectedOption,
    onSelectOption,
  }) => {
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
          {data.options.map((option) => (
            <div
              key={option.letter}
              className={`${styles.questionOption} ${
                selectedOption === option.letter ? styles.selected : ""
              } ${
                showAnswer && data.correctAnswer === option.letter
                  ? styles.correct
                  : ""
              }`}
              onClick={() => onSelectOption(option.letter)}
            >
              <strong>{option.letter})</strong> {option.text}
            </div>
          ))}
        </div>

        {data.correctAnswer && !showAnswer && (
          <div className={styles.answerControls}>
            <button className={styles.showAnswerBtn} onClick={onShowAnswer}>
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <h1>📝 PERSENAUT</h1>

      <div className={styles.demoBanner}>
        <p>
          🔐 Esta es una versión demo.{" "}
          <a href="auth/register.html">Regístrate</a> para desbloquear:
        </p>
        <ul>
          <li>✔️ Historial de preguntas</li>
          <li>✔️ Guardar y ver tu progreso</li>
          <li>✔️ Automatización de la frecuencia de los retos</li>
        </ul>
      </div>

      <div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="tematica">
            Temática de la Pregunta:
          </label>
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
          <label className={styles.label} htmlFor="nivel">
            Nivel de Dificultad:
          </label>
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
          className={`${styles.btn} ${loading ? styles.btnDisabled : ""}`}
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
        <div
          className={`${styles.result} ${
            result.isError ? styles.resultError : ""
          }`}
        >
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
                  onShowAnswer={() =>
                    setResult((prev) => ({ ...prev, showAnswer: true }))
                  }
                  showAnswer={result.showAnswer}
                  selectedOption={result.selectedOption}
                  onSelectOption={(option) =>
                    setResult((prev) => ({ ...prev, selectedOption: option }))
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className={`${styles.btn} ${loading ? styles.btnDisabled : ""}`}
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
              onShowAnswer={() =>
                setTestResult((prev) => ({ ...prev, showAnswer: true }))
              }
              showAnswer={testResult.showAnswer}
              selectedOption={testResult.selectedOption}
              onSelectOption={(option) =>
                setTestResult((prev) => ({ ...prev, selectedOption: option }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;
