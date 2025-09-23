import React, { useState } from "react";
import styles from "./Demo.module.css";
import QuestionForm from "./QuestionForm";
import QuestionDisplay from "./QuestionDisplay";
import { formatQuestion } from "../services/promptService";
import { testGroq } from "../services/apiService";
import { Link } from "react-router-dom";

const Demo = () => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState({
    show: false,
    content: "",
    showAnswer: false,
    selectedOption: null,
  });

  const handleGenerateQuestion = async (formData) => {
    setLoading(true);
    setTestResult({
      show: false,
      content: "",
      showAnswer: false,
      selectedOption: null,
    });

    try {
      const { tematica: theme, nivel: level } = formData;

      if (!theme || !level) {
        throw new Error("Tema y nivel son requeridos");
      }

      // Pasar los datos en el formato correcto
      const result = await testGroq({
        theme: theme,
        level: level,
        previousQuestions: [],
      });

      // ✅ AQUÍ ESTÁ LA CLAVE: usar formatQuestion para procesar la respuesta
      const formatted = formatQuestion(result);

      setTestResult({
        show: true,
        content: formatted,
        showAnswer: false,
        selectedOption: null,
      });
    } catch (error) {
      console.error("Error en demo:", error);
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

      <QuestionForm
        onSubmit={handleGenerateQuestion}
        loading={loading}
        showPreferences={false}
      />

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Generando tu pregunta personalizada...</p>
        </div>
      )}

      {testResult.show && (
        <div className={styles.result}>
          <h3>📊 Pregunta Generada</h3>
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
