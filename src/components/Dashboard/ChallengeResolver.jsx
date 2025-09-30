// components/ChallengeResolver/ChallengeResolver.jsx
import React, { useState, useEffect } from "react";
import QuestionDisplay from "../QuestionDisplay";
import styles from "./ChallengeResolver.module.css";

const ChallengeResolver = ({ challenge, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
      setSelectedOption(null);
      setShowAnswer(false);
      setIsCompleted(false);
      console.log("🔄 Estado reiniciado para nuevo reto"); // Opcional para depuración
    }, [challenge]);

  // Transformar los datos del challenge al formato que espera QuestionDisplay
  const questionData = {
    questionText: challenge.question,
    options: Array.isArray(challenge.options)
      ? challenge.options
      : JSON.parse(challenge.options || "[]"),
    correctAnswer: challenge.correct_answer,
  };

  const handleOptionSelect = (optionLetter) => {
    if (!isCompleted) {
      setSelectedOption(optionLetter);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsCompleted(true);
  };

  const handleNext = () => {
    onComplete();
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setShowAnswer(true);
      setIsCompleted(true);
    }
  };

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

      {/* Acciones específicas del ChallengeResolver */}
      <div className={styles.actions}>
        {!showAnswer ? (
          <button
            className={`${styles.submitButton} ${
              !selectedOption ? styles.disabled : ""
            }`}
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            📨 Enviar Respuesta
          </button>
        ) : (
          <div className={styles.resultActions}>
            <div className={styles.resultFeedback}>
              {selectedOption === challenge.correct_answer ? (
                <div className={styles.correctFeedback}>
                  ✅ ¡Excelente! Respuesta correcta
                </div>
              ) : (
                <div className={styles.incorrectFeedback}>
                  ❌ Has seleccionado: {selectedOption} | Correcta:{" "}
                  {challenge.correct_answer}
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
