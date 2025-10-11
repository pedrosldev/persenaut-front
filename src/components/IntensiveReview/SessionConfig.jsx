// components/IntensiveReview/SessionConfig.jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./SessionConfig.module.css";
const USER_THEMES_API = import.meta.env.VITE_USER_THEMES_INTENSIVE_REVIEW;

const SessionConfig = ({ user, onStart }) => {
  const [theme, setTheme] = useState("");
  const [gameMode, setGameMode] = useState("survival"); // ← Nuevo estado para el modo
  const [userThemes, setUserThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadThemes = useCallback(async () => {
    try {
      const response = await fetch(`${USER_THEMES_API}/${user.id}`);
      if (!response.ok) throw new Error("Error al cargar temas");

      const data = await response.json();
      setUserThemes(data.themes || []);
    } catch (error) {
      console.error("Error loading themes:", error);
      alert("Error al cargar temas: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  // Definición de modos de juego
  const gameModes = [
    {
      id: "survival",
      name: "🏆 Modo Supervivencia",
      description: "Continúa hasta que falles. Sin límite de tiempo.",
    },
    {
      id: "timed",
      name: "⚡ Ráfaga Contra Reloj",
      description: "Máximo de preguntas en 3 minutos",
    },
  ];

  // Encontrar el modo actual seleccionado
  const currentMode = gameModes.find((mode) => mode.id === gameMode);

  if (loading) {
    return <div className={styles.loading}>Cargando temas...</div>;
  }

  return (
    <div className={styles.config}>
      <h2>{currentMode?.name || "Modo de Repaso"}</h2>
      <p className={styles.subtitle}>{currentMode?.description || ""}</p>

      <div className={styles.form}>
        {/* Selector de tema */}
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

        {/* Selector de modo de juego - NUEVO */}
        <div className={styles.formGroup}>
          <label>Modo de juego:</label>
          <div className={styles.modeOptions}>
            {gameModes.map((mode) => (
              <label key={mode.id} className={styles.modeOption}>
                <input
                  type="radio"
                  name="gameMode"
                  value={mode.id}
                  checked={gameMode === mode.id}
                  onChange={(e) => setGameMode(e.target.value)}
                />
                <div className={styles.modeInfo}>
                  <div className={styles.modeName}>{mode.name}</div>
                  <div className={styles.modeDescription}>
                    {mode.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {userThemes.length === 0 && (
          <div className={styles.noThemes}>
            <p>No tienes retos guardados. Crea algunos retos primero.</p>
          </div>
        )}

        <button
          onClick={() => onStart(theme, gameMode)} // ← Pasar gameMode también
          disabled={!theme || userThemes.length === 0}
          className={styles.startButton}
        >
          {gameMode === "survival"
            ? "🏁 Iniciar Supervivencia"
            : "🚀 Comenzar Ráfaga"}
        </button>
      </div>
    </div>
  );
};

export default SessionConfig;
