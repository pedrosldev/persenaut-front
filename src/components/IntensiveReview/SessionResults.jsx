// src/components/IntensiveReview/SessionResults.jsx
import React from "react";
import styles from "./SessionResults.module.css";

const SessionResults = ({ results, onRestart }) => {
  const accuracy = Math.round((results.correct / results.total) * 100);

  const getMessage = () => {
    if (accuracy >= 90) return "¡Excelente! 🎯";
    if (accuracy >= 70) return "¡Muy bien! 🚀";
    if (accuracy >= 50) return "¡Buen trabajo! 💪";
    return "¡Sigue practicando! 👍";
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTitle = () => {
    return results.gameMode === "survival"
      ? "🏆 Resultados de Supervivencia"
      : "⚡ Resultados de la Ráfaga";
  };

  const getButtonText = () => {
    return results.gameMode === "survival"
      ? "🔄 Nueva Supervivencia"
      : "🚀 Nueva Ráfaga";
  };

  return (
    <div className={styles.results}>
      <div className={styles.header}>
        <h2>{getTitle()}</h2>
        <p className={styles.message}>{getMessage()}</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>
            {results.correct}/{results.total}
          </div>
          <div className={styles.statLabel}>Correctas</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statValue}>{accuracy}%</div>
          <div className={styles.statLabel}>Precisión</div>
        </div>

        {results.gameMode === "timed" && results.timeUsed && (
          <div className={styles.stat}>
            <div className={styles.statValue}>
              {formatTime(results.timeUsed)}
            </div>
            <div className={styles.statLabel}>Tiempo usado</div>
          </div>
        )}

        {results.gameMode === "survival" && (
          <div className={styles.stat}>
            <div className={styles.statValue}>{results.correct}</div>
            <div className={styles.statLabel}>Preguntas consecutivas</div>
          </div>
        )}
      </div>

      <button onClick={onRestart} className={styles.restartButton}>
        {getButtonText()}
      </button>
    </div>
  );
};

export default SessionResults;
