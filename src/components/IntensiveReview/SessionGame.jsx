// components/IntensiveReview/SessionGame.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./SessionGame.module.css";
import { saveIntensiveResponse } from "../../services/apiService";

const SessionGame = ({ session, onEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(
    session.gameMode === "timed" ? 180 : null
  );
  const [gameActive, setGameActive] = useState(true);
  const [gameState, setGameState] = useState("playing");
  const questionStartTime = useRef(Date.now());
  const currentChallenge = session.challenges[currentIndex];

  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentIndex]);

  // ✅ FUNCIÓN SIMPLIFICADA usando apiService
  const saveIntensiveResponseToAPI = async (
    questionId,
    selectedAnswer,
    isCorrect,
    responseTime
  ) => {
    if (!session?.sessionId) {
      console.warn("No sessionId disponible");
      return;
    }

    try {
      await saveIntensiveResponse({
        sessionId: session.sessionId,
        questionId: questionId,
        selectedAnswer: selectedAnswer,
        isCorrect: isCorrect,
        responseTime: responseTime,
      });
      console.log("✅ Respuesta intensiva guardada");
    } catch (error) {
      console.error("❌ Error guardando respuesta:", error);
    }
  };

  const handleEndSession = useCallback(
    (finalCorrect, finalIncorrect) => {
      console.log("🎯 DEBUG SessionGame - Enviando theme:", session.theme);
      onEnd(finalCorrect, finalIncorrect, timeRemaining, session.theme);
    },
    [onEnd, timeRemaining, session.theme]
  );

  // Timer countdown SOLO para modo ráfaga
  useEffect(() => {
    if (session.gameMode !== "timed") return;
    if (!gameActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          setGameState("ended");
          setTimeout(() => {
            setGameState("showingResults");
            setTimeout(() => {
              handleEndSession(correctAnswers, incorrectAnswers);
            }, 1500);
          }, 2000);
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
    session.gameMode,
  ]);

  const handleAnswer = (selectedOption) => {
    if (!gameActive) return;

    const endTime = Date.now();
    const responseTime = Math.floor(
      (endTime - questionStartTime.current) / 1000
    );
    const isCorrect = selectedOption === currentChallenge.correct_answer;

    // ✅ USA la nueva función con apiService
    saveIntensiveResponseToAPI(
      currentChallenge.id,
      selectedOption,
      isCorrect,
      responseTime
    );

    if (isCorrect) {
      setCorrectAnswers((prev) => [...prev, currentChallenge.id]);
    } else {
      setIncorrectAnswers((prev) => [...prev, currentChallenge.id]);

      // En modo supervivencia, terminar al fallar
      if (session.gameMode === "survival") {
        setGameActive(false);
        setGameState("ended");
        setTimeout(() => {
          setGameState("showingResults");
          setTimeout(() => {
            handleEndSession(correctAnswers, [
              ...incorrectAnswers,
              currentChallenge.id,
            ]);
          }, 1500);
        }, 2000);
        return;
      }
    }

    // Siguiente pregunta o terminar
    if (currentIndex + 1 < session.challenges.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameActive(false);
      setGameState("ended");
      setTimeout(() => {
        setGameState("showingResults");
        setTimeout(() => {
          handleEndSession(correctAnswers, incorrectAnswers);
        }, 1500);
      }, 2000);
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

  const getEndMessage = () => {
    if (session.gameMode === "survival") {
      return incorrectAnswers.length > 0 ? "¡Has fallado!" : "¡Completado!";
    }
    return "¡Tiempo completado!";
  };

  const getTransitionMessage = () => {
    if (session.gameMode === "survival") {
      return incorrectAnswers.length > 0
        ? "Analizando tu racha..."
        : "¡Racha perfecta!";
    }
    return "Calculando tu velocidad...";
  };

  // Render condicional por estado del juego
  if (gameState === "ended") {
    return (
      <div className={styles.gameEndTransition}>
        <div className={styles.transitionContent}>
          <h2>{getEndMessage()}</h2>
          <div className={styles.pulseAnimation}>🎯</div>
          <p>Preparando tus resultados...</p>
        </div>
      </div>
    );
  }

  if (gameState === "showingResults") {
    return (
      <div className={styles.resultsTransition}>
        <div className={styles.transitionContent}>
          <h3>🎯 {getTransitionMessage()}</h3>
          <div className={styles.loadingSpinner}></div>
          <p>¡Tu desempeño fue increíble!</p>
        </div>
      </div>
    );
  }

  // Estado normal de juego
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
    </div>
  );
};

export default SessionGame;
