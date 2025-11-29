// components/ChallengeResolver/ChallengeResolver.jsx - VERSIÓN UNIFICADA
import React, { useState, useEffect, useRef } from "react";
import QuestionDisplay from "../Common/QuestionDisplay";
import styles from "./ChallengeResolver.module.css";
import {
  saveUserResponse,

} from "../../services/apiService";

const ChallengeResolver = ({
  challenge,
  onComplete,
  userId,
  mode = "normal",
  sessionId = null, // eslint-disable-line no-unused-vars
}) => {
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
    startTime.current = Date.now();
    console.log("🔄 Estado reiniciado para nuevo reto");
  }, [challenge]);

  // ✅ FUNCIÓN ÚNICA PARA AMBOS MODOS
  const saveResponse = async () => {
    if (!userId || !challenge?.id) {
      console.warn("⚠️ No se puede guardar: falta userId o challenge.id");
      return null;
    }

    const endTime = Date.now();
    const responseTime = Math.floor((endTime - startTime.current) / 1000);

    try {
      const result= await saveUserResponse({
        userId: userId,
          questionId: challenge.id,
          selectedAnswer: selectedOption,
          responseTime: responseTime,
        });
        console.log("✅ Respuesta NORMAL guardada:", result);
      

      return result;
    } catch (error) {
      console.error("❌ Error guardando respuesta:", error);
      return null;
    }
  };

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
    const result = await saveResponse(); 
    setSaveResult(result); 
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
    const result = await saveResponse(); // ← Cambia el nombre aquí
    setSaveResult(result);
    setShowAnswer(true);
    setIsCompleted(true);
    setIsSubmitting(false);
  }
};

  const isCorrect =
    saveResult?.isCorrect !== undefined
      ? saveResult.isCorrect
      : selectedOption === challenge.correct_answer;

  return (
    <div className={styles.resolverContainer}>
      <div className={styles.challengeHeader}>
        <h2>🎯 Resolver Reto {mode === "intensive" ? "(Intensivo)" : ""}</h2>
        <div className={styles.challengeInfo}>
          <span className={styles.theme}>{challenge.theme}</span>
          <span className={styles.level}>{challenge.level}</span>
          {challenge.frequency && mode !== "intensive" && (
            <span className={styles.frequency}>🔄 {challenge.frequency}</span>
          )}
        </div>
      </div>

      <QuestionDisplay
        data={questionData}
        showAnswer={showAnswer}
        selectedOption={selectedOption}
        onShowAnswer={handleShowAnswer}
        onSelectOption={handleOptionSelect}
      />

      {isSubmitting && (
        <div className={styles.savingIndicator}>
          💾 Guardando tu respuesta...
        </div>
      )}

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
