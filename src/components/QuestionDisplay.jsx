import React from "react";
import styles from "./QuestionDisplay.module.css";

const QuestionDisplay = ({
  data,
  isError = false,
  showAnswer = false,
  selectedOption = null,
  onShowAnswer,
  onSelectOption,
}) => {
  if (isError || data.error) {
    return (
      <div className={styles.errorContainer}>
        <h4>⚠️ Error</h4>
        <p>{data.error}</p>
      </div>
    );
  }

  if (!data.questionText) {
    return (
      <div className={styles.noData}>
        <p>No se pudo generar la pregunta</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>¡Tu pregunta está lista! 📝</h3>

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
            onClick={() => onSelectOption && onSelectOption(option.letter)}
          >
            <strong>{option.letter})</strong> {option.text}
          </div>
        ))}
      </div>

      {data.correctAnswer && !showAnswer && onShowAnswer && (
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

export default QuestionDisplay;
