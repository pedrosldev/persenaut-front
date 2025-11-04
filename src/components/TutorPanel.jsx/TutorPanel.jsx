// src/components/Dashboard/TutorPanel/TutorPanel.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./TutorPanel.module.css";
import { getTutorAdvice } from "../../services/apiService";

const TutorPanel = ({ userId }) => {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

const fetchTutorAdvice = useCallback(async () => {
  try {
    setLoading(true);
    const data = await getTutorAdvice(userId, timeRange);

    if (data.analysis) {
      setAdvice(data);
    } else if (data.advice) {
      setAdvice(data.advice);
    } else {
      console.warn("Formato inesperado en la respuesta del tutor:", data);
    }
  } catch (error) {
    console.error("Error fetching tutor advice:", error);
  } finally {
    setLoading(false);
  }
}, [userId, timeRange]);

  // useEffect que usa la función memoizada
  useEffect(() => {
    fetchTutorAdvice();
  }, [fetchTutorAdvice]); // ✅ Solo depende de fetchTutorAdvice

  if (loading) {
    return (
      <div className={styles.tutorPanel}>
        <h3><img src="/persenaut.svg" alt="" /> Tu Tutor IA</h3>
        <div className={styles.loading}>Analizando tu progreso...</div>
      </div>
    );
  }

  if (!advice) {
    return (
      <div className={styles.tutorPanel}>
        <h3>
          <img src="/persenaut.svg" alt="" /> Tu Tutor IA
        </h3>
        <div className={styles.error}>
          No se pudieron cargar las recomendaciones
        </div>
        <button onClick={fetchTutorAdvice} className={styles.refreshButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tutorPanel}>
      <div className={styles.tutorHeader}>
        <h3>
          <img src="/persenaut.svg" alt="" /> Tu Tutor IA
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={styles.timeRangeSelect}
        >
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="quarter">Últimos 3 meses</option>
        </select>
      </div>

      <div className={styles.analysisSection}>
        <h4>📊 Análisis</h4>
        <p>{advice.analysis || "No hay análisis disponible"}</p>
      </div>

      <div className={styles.recommendationsGrid}>
        <div className={styles.recommendationColumn}>
          <h4>✅ Fortalezas</h4>
          <ul>
            {advice.strengths && advice.strengths.length > 0 ? (
              advice.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))
            ) : (
              <li>No se identificaron fortalezas específicas</li>
            )}
          </ul>
        </div>

        <div className={styles.recommendationColumn}>
          <h4>🎯 Áreas a Mejorar</h4>
          <ul>
            {advice.weaknesses && advice.weaknesses.length > 0 ? (
              advice.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))
            ) : (
              <li>No se identificaron áreas de mejora</li>
            )}
          </ul>
        </div>
      </div>

      <div className={styles.recommendationsSection}>
        <h4>💡 Recomendaciones</h4>
        {advice.recommendations && advice.recommendations.length > 0 ? (
          advice.recommendations.map((rec, index) => (
            <div
              key={index}
              className={`${styles.recommendation} ${
                styles[rec.priority] || styles.medium
              }`}
            >
              <span className={styles.priorityBadge}>
                {rec.priority || "medium"}
              </span>
              <h5>{rec.title || "Recomendación"}</h5>
              <p>{rec.description || "Sin descripción disponible"}</p>
            </div>
          ))
        ) : (
          <p>No hay recomendaciones disponibles</p>
        )}
      </div>

      <div className={styles.goalsSection}>
        <h4>🎯 Objetivos Semanales</h4>
        <ul>
          {advice.weekly_goals && advice.weekly_goals.length > 0 ? (
            advice.weekly_goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))
          ) : (
            <li>Completar al menos 5 retos esta semana</li>
          )}
        </ul>
      </div>

      <div className={styles.encouragement}>
        <p>
          💪{" "}
          {advice.encouragement || "¡Sigue así! Tu esfuerzo dará resultados."}
        </p>
      </div>

      <button onClick={fetchTutorAdvice} className={styles.refreshButton}>
        Actualizar Análisis
      </button>
    </div>
  );
};

export default TutorPanel;
