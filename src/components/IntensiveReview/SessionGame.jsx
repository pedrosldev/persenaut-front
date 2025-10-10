// components/IntensiveReview/SessionGame.jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./SessionGame.module.css";

const SessionGame = ({ session, onEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [gameActive, setGameActive] = useState(true);

  const currentChallenge = session.challenges[currentIndex];

  // ✅ useCallback para onEnd
  const handleEndSession = useCallback(
    (finalCorrect, finalIncorrect) => {
      onEnd(finalCorrect, finalIncorrect);
    },
    [onEnd]
  );

  // Timer countdown
  useEffect(() => {
    if (!gameActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          // Usar la versión memoizada
          setTimeout(
            () => handleEndSession(correctAnswers, incorrectAnswers),
            500
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    gameActive,
    timeRemaining,
    correctAnswers,
    incorrectAnswers,
    handleEndSession,
  ]); // ✅ Todas las dependencias

  const handleAnswer = (selectedOption) => {
    if (!gameActive) return;

    const isCorrect = selectedOption === currentChallenge.correct_answer;

    if (isCorrect) {
      setCorrectAnswers((prev) => [...prev, currentChallenge.id]);
    } else {
      setIncorrectAnswers((prev) => [...prev, currentChallenge.id]);
    }

    // Siguiente pregunta o terminar
    if (currentIndex + 1 < session.challenges.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameActive(false);
      setTimeout(() => handleEndSession(correctAnswers, incorrectAnswers), 500);
    }
  };

  const progress = ((currentIndex + 1) / session.challenges.length) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.game}>
      <div className={styles.header}>
        <div className={styles.timerSection}>
          <div
            className={`${styles.timer} ${
              timeRemaining <= 30 ? styles.warning : ""
            }`}
          >
            ⏱️ {formatTime(timeRemaining)}
          </div>
          {!gameActive && <div className={styles.timeUp}>¡Tiempo!</div>}
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className={styles.stats}>
          <span>
            Pregunta {currentIndex + 1} de {session.challenges.length}
          </span>
          <span>✅ {correctAnswers.length}</span>
          <span>❌ {incorrectAnswers.length}</span>
        </div>
      </div>

      <div className={styles.challenge}>
        <div className={styles.theme}>{currentChallenge.theme}</div>

        <h3 className={styles.question}>{currentChallenge.question}</h3>

        <div className={styles.options}>
          {currentChallenge.options.map((option) => (
            <button
              key={option.letter}
              onClick={() => handleAnswer(option.letter)}
              className={styles.option}
              disabled={!gameActive}
            >
              <span className={styles.optionLetter}>{option.letter})</span>
              <span className={styles.optionText}>{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {!gameActive && (
        <div className={styles.gameOver}>
          <p>El tiempo ha terminado</p>
          <button
            onClick={() => handleEndSession(correctAnswers, incorrectAnswers)}
            className={styles.resultsButton}
          >
            Ver Resultados
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionGame;
