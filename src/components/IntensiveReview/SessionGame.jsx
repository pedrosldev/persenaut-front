// components/IntensiveReview/SessionGame.jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./SessionGame.module.css";

const SessionGame = ({ session, onEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(
    session.gameMode === "timed" ? 180 : null // ← Tiempo solo para modo ráfaga
  );
  const [gameActive, setGameActive] = useState(true);

  const currentChallenge = session.challenges[currentIndex];

  const handleEndSession = useCallback(
    (finalCorrect, finalIncorrect) => {
      onEnd(finalCorrect, finalIncorrect, timeRemaining);
    },
    [onEnd, timeRemaining]
  );

  // Timer countdown SOLO para modo ráfaga
  useEffect(() => {
    if (session.gameMode !== "timed") return; // ← Solo ejecutar para modo ráfaga
    if (!gameActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
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
    session.gameMode, // ← Dependencia importante
  ]);

  const handleAnswer = (selectedOption) => {
    if (!gameActive) return;

    const isCorrect = selectedOption === currentChallenge.correct_answer;

    if (isCorrect) {
      setCorrectAnswers((prev) => [...prev, currentChallenge.id]);
    } else {
      setIncorrectAnswers((prev) => [...prev, currentChallenge.id]);

      // En modo supervivencia, terminar al fallar
      if (session.gameMode === "survival") {
        setGameActive(false);
        setTimeout(
          () =>
            handleEndSession(correctAnswers, [
              ...incorrectAnswers,
              currentChallenge.id,
            ]),
          500
        );
        return;
      }
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
    if (seconds === null) return "∞";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGameTitle = () => {
    return session.gameMode === "survival"
      ? "🏆 Modo Supervivencia"
      : "⚡ Ráfaga Contra Reloj";
  };

  return (
    <div className={styles.game}>
      <div className={styles.header}>
        <div className={styles.timerSection}>
          <div
            className={`${styles.timer} ${
              timeRemaining !== null && timeRemaining <= 30
                ? styles.warning
                : ""
            }`}
          >
            {session.gameMode === "timed" ? "⏱️" : "🏆"}{" "}
            {formatTime(timeRemaining)}
          </div>
          {!gameActive && (
            <div className={styles.timeUp}>
              {session.gameMode === "survival" ? "¡Has fallado!" : "¡Tiempo!"}
            </div>
          )}
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

      <div className={styles.gameTitle}>
        <h2>{getGameTitle()}</h2>
        <p>
          {session.gameMode === "survival"
            ? "Continúa hasta que falles"
            : "Responde máximo de preguntas en 3 minutos"}
        </p>
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
          <p>
            {session.gameMode === "survival"
              ? "¡Has fallado una pregunta!"
              : "El tiempo ha terminado"}
          </p>
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
