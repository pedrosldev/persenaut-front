// components/ChallengeResolver/ChallengeResolver.jsx
import React, { useState, useEffect, useRef } from "react";
import QuestionDisplay from "../QuestionDisplay";
import styles from "./ChallengeResolver.module.css";
const API_SAVE_RESPONSE = import.meta.env.VITE_API_SAVE_RESPONSE;

const ChallengeResolver = ({ challenge, onComplete, userId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const startTime = useRef(null);

  useEffect(() => {
    setSelectedOption(null);
    setShowAnswer(false);
    setIsCompleted(false);
    setIsSubmitting(false);
    setSaveResult(null);
    startTime.current = Date.now(); // Iniciar timer cuando llega un nuevo challenge
    console.log("🔄 Estado reiniciado para nuevo reto");
  }, [challenge]);

  // Función para guardar la respuesta en el backend
  const saveUserResponse = async () => {
    if (!userId || !challenge?.id) {
      console.warn("⚠️ No se puede guardar: falta userId o challenge.id");
      return null;
    }

    const endTime = Date.now();
    const responseTime = Math.floor((endTime - startTime.current) / 1000); // Tiempo en segundos

    try {
      const response = await fetch(`${API_SAVE_RESPONSE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          questionId: challenge.id,
          selectedAnswer: selectedOption,
          responseTime: responseTime,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Respuesta guardada correctamente:", result);
        return result;
      } else {
        console.error("❌ Error al guardar respuesta:", result);
        return null;
      }
    } catch (error) {
      console.error("❌ Error de red al guardar respuesta:", error);
      return null;
    }
  };

  // Transformar los datos del challenge al formato que espera QuestionDisplay
  const questionData = {
    questionText: challenge.question,
    options: Array.isArray(challenge.options)
      ? challenge.options
      : JSON.parse(challenge.options || "[]"),
    correctAnswer: challenge.correct_answer,
  };

  const handleOptionSelect = (optionLetter) => {
    if (!isCompleted && !isSubmitting) {
      setSelectedOption(optionLetter);
    }
  };

  const handleShowAnswer = async () => {
    if (!selectedOption) return;

    setIsSubmitting(true);

    // Guardar la respuesta antes de mostrar el resultado
    const saveResponse = await saveUserResponse();
    setSaveResult(saveResponse);

    setShowAnswer(true);
    setIsCompleted(true);
    setIsSubmitting(false);
  };

  const handleNext = () => {
    onComplete();
  };

  const handleSubmit = async () => {
    if (selectedOption && !isSubmitting) {
      setIsSubmitting(true);

      // Guardar la respuesta
      const saveResponse = await saveUserResponse();
      setSaveResult(saveResponse);

      setShowAnswer(true);
      setIsCompleted(true);
      setIsSubmitting(false);
    }
  };

  // Determinar si la respuesta fue correcta
  const isCorrect =
    saveResult?.isCorrect !== undefined
      ? saveResult.isCorrect
      : selectedOption === challenge.correct_answer;

  return (
    <div className={styles.resolverContainer}>
      <div className={styles.challengeHeader}>
        <h2>🎯 Resolver Reto</h2>
        <div className={styles.challengeInfo}>
          <span className={styles.theme}>{challenge.theme}</span>
          <span className={styles.level}>{challenge.level}</span>
          {challenge.frequency && (
            <span className={styles.frequency}>🔄 {challenge.frequency}</span>
          )}
        </div>
      </div>

      {/* ✅ REUTILIZAMOS QuestionDisplay */}
      <QuestionDisplay
        data={questionData}
        showAnswer={showAnswer}
        selectedOption={selectedOption}
        onShowAnswer={handleShowAnswer}
        onSelectOption={handleOptionSelect}
      />

      {/* Estado de guardado */}
      {isSubmitting && (
        <div className={styles.savingIndicator}>
          💾 Guardando tu respuesta...
        </div>
      )}

      {/* Acciones específicas del ChallengeResolver */}
      <div className={styles.actions}>
        {!showAnswer ? (
          <button
            className={`${styles.submitButton} ${
              !selectedOption || isSubmitting ? styles.disabled : ""
            }`}
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? "📨 Guardando..." : "📨 Enviar Respuesta"}
          </button>
        ) : (
          <div className={styles.resultActions}>
            <div className={styles.resultFeedback}>
              {isCorrect ? (
                <div className={styles.correctFeedback}>
                  ✅ ¡Excelente! Respuesta correcta
                  {saveResult && (
                    <div className={styles.saveStatus}>✓ Guardado</div>
                  )}
                </div>
              ) : (
                <div className={styles.incorrectFeedback}>
                  ❌ Has seleccionado: {selectedOption} | Correcta:{" "}
                  {challenge.correct_answer}
                  {saveResult && (
                    <div className={styles.saveStatus}>✓ Guardado</div>
                  )}
                </div>
              )}
            </div>
            <button className={styles.nextButton} onClick={handleNext}>
              ➡️ Continuar
            </button>
          </div>
        )}
      </div>

 
    </div>
  );
};

export default ChallengeResolver;
