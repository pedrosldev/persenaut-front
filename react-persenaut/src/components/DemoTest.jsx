import React, { useState } from "react";
import styles from "./Demo.module.css";
import QuestionForm from "./QuestionForm";
import QuestionDisplay from "./QuestionDisplay";
import { useQuestionHistory } from "./hooks/useQuestionHistory";
import { generatePrompt, formatQuestion } from "../services/promptService";
import {
  fetchChallenge,
  testGroq,
  saveQuestionToDB,
} from "../services/apiService";

const DemoTest = () => {
  const [questionHistory, updateHistory] = useQuestionHistory();
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

  const handleFormSubmit = async (formData) => {
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
        alert(`✅ Pregunta guardada en BD con ID: ${saveResult.id}`);
      } catch (saveError) {
        console.error(
          "Error al guardar (pero la pregunta se mostró):",
          saveError
        );
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
          🔐 Esta es una versión demo.{" "}
          <a href="auth/register.html">Regístrate</a> para desbloquear:
        </p>
        <ul>
          <li>✔️ Historial de preguntas</li>
          <li>✔️ Guardar y ver tu progreso</li>
          <li>✔️ Automatización de la frecuencia de los retos</li>
        </ul>
      </div>

      <QuestionForm
        onSubmit={handleFormSubmit}
        onTestGroq={handleTestGroq}
        loading={loading}
      />

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

export default DemoTest;
