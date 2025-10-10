// src/components/IntensiveReview/SessionResults.jsx
import React from "react";
import styles from "./SessionResults.module.css"; // ← CSS Module

// Modificar SessionResults para recibir y mostrar tiempo
const SessionResults = ({ results, onRestart, timeSpent = 180 }) => {
  const accuracy = Math.round((results.correct / results.total) * 100);
  const timeUsed = 180 - timeSpent; // Tiempo realmente usado

  const getMessage = () => {
    if (accuracy >= 90) return "¡Excelente! 🎯";
    if (accuracy >= 70) return "¡Muy bien! 🚀"; 
    if (accuracy >= 50) return "¡Buen trabajo! 💪";
    return "¡Sigue practicando! 👍";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.results}>
      <div className={styles.header}>
        <h2>🎯 Resultados de la Rafaga</h2>
        <p className={styles.message}>{getMessage()}</p>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{results.correct}/{results.total}</div>
          <div className={styles.statLabel}>Correctas</div>
        </div>
        
        <div className={styles.stat}>
          <div className={styles.statValue}>{accuracy}%</div>
          <div className={styles.statLabel}>Precisión</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statValue}>{formatTime(timeUsed)}</div>
          <div className={styles.statLabel}>Tiempo usado</div>
        </div>
      </div>
      
      <button onClick={onRestart} className={styles.restartButton}>
        🔄 Nueva Rafaga
      </button>
    </div>
  );
};

export default SessionResults;
