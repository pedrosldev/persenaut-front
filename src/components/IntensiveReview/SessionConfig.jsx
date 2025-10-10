// components/IntensiveReview/SessionConfig.jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./SessionConfig.module.css";
const USER_THEMES_API = import.meta.env.VITE_USER_THEMES_INTENSIVE_REVIEW;

const SessionConfig = ({ user, onStart }) => {
  const [theme, setTheme] = useState("");
  const [userThemes, setUserThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ useCallback para memoizar la función
  const loadThemes = useCallback(async () => {
    try {
      const response = await fetch(
        `${USER_THEMES_API}/${user.id}`
      );
      if (!response.ok) throw new Error("Error al cargar temas");

      const data = await response.json();
      setUserThemes(data.themes || []);
    } catch (error) {
      console.error("Error loading themes:", error);
      alert("Error al cargar temas: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]); // ✅ Dependencia correcta

  useEffect(() => {
    loadThemes();
  }, [loadThemes]); // ✅ Ahora loadThemes es estable

  if (loading) {
    return <div className={styles.loading}>Cargando temas...</div>;
  }

  return (
    <div className={styles.config}>
      <h2>⚡ Rafaga Contra Reloj</h2>
      <p className={styles.subtitle}>
        Responde máximo de preguntas en <strong>3 minutos</strong>
      </p>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Elige un tema para repasar:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Selecciona un tema --</option>
            {userThemes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {userThemes.length === 0 && (
          <div className={styles.noThemes}>
            <p>No tienes retos guardados. Crea algunos retos primero.</p>
          </div>
        )}

        <button
          onClick={() => onStart(theme)}
          disabled={!theme || userThemes.length === 0}
          className={styles.startButton}
        >
          🚀 Comenzar Rafaga
        </button>
      </div>
    </div>
  );
};

export default SessionConfig;
