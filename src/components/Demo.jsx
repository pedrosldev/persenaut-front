import React, { useState } from "react";
import styles from "./Demo.module.css";
import QuestionForm from "./QuestionForm";
import QuestionDisplay from "./QuestionDisplay";
// import { generatePrompt, formatQuestion } from "../services/promptService";
import { testGroq } from "../services/apiService";
import { Link } from "react-router-dom";

const Demo = () => {
  const [loading, setLoading] = useState(false);
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

  const handleTestGroq = async (formData) => {
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

  return (
    <div className={styles.container}>
      <h1>📝 PERSENAUT</h1>

      <div className={styles.demoBanner}>
        <p>
          🔐 Esta es una versión demo. <Link to="/register">Regístrate</Link>{" "}
          para desbloquear:
        </p>
        <ul>
          <li>✔️ Historial de preguntas</li>
          <li>✔️ Guardar y ver tu progreso</li>
          <li>✔️ Automatización de la frecuencia de los retos</li>
        </ul>
      </div>

      <QuestionForm onTestGroq={handleTestGroq} loading={loading} />

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
          <QuestionDisplay
            data={result.content}
            isError={result.isError}
            showAnswer={result.showAnswer}
            selectedOption={result.selectedOption}
            onShowAnswer={() =>
              setResult((prev) => ({ ...prev, showAnswer: true }))
            }
            onSelectOption={(option) =>
              setResult((prev) => ({ ...prev, selectedOption: option }))
            }
          />
        </div>
      )}

      {testResult.show && (
        <div className={styles.result}>
          <h3>Resultado Test Groq</h3>
          <QuestionDisplay
            data={testResult.content}
            showAnswer={testResult.showAnswer}
            selectedOption={testResult.selectedOption}
            onShowAnswer={() =>
              setTestResult((prev) => ({ ...prev, showAnswer: true }))
            }
            onSelectOption={(option) =>
              setTestResult((prev) => ({ ...prev, selectedOption: option }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default Demo;
