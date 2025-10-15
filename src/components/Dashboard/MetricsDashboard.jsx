// components/Dashboard/MetricsDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./MetricsDashboard.module.css";
const METRICS_API_BASE = import.meta.env.VITE_METRICS_API_BASE;
// Mover las funciones helper fuera del componente principal
const calculateLevel = (points) => {
  if (points >= 1000) return "Experto";
  if (points >= 500) return "Avanzado";
  if (points >= 200) return "Intermedio";
  return "Principiante";
};

const getNextLevelPoints = (currentPoints) => {
  if (currentPoints < 200) return 200;
  if (currentPoints < 500) return 500;
  if (currentPoints < 1000) return 1000;
  return currentPoints;
};

// Componente para la pestaña de Resumen
const OverviewTab = ({ metrics }) => {
  const { overall, gameModes } = metrics; // Removí 'timeline' que no se usaba

  if (!overall) {
    return (
      <div className={styles.noData}>
        Aún no tienes métricas. ¡Completa tu primera sesión!
      </div>
    );
  }

  const currentLevel = calculateLevel(overall.total_points || 0);
  const nextLevelPoints = getNextLevelPoints(overall.total_points || 0);
  const progressPercentage = overall.total_points
    ? Math.min((overall.total_points / nextLevelPoints) * 100, 100)
    : 0;

  return (
    <div className={styles.overview}>
      {/* Tarjeta de puntuación principal */}
      <div className={styles.scoreCard}>
        <div className={styles.scoreHeader}>
          <h2>🏆 Tu Puntuación</h2>
          <span className={styles.levelBadge}>{currentLevel}</span>
        </div>
        <div className={styles.scoreValue}>{overall.total_points || 0}</div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className={styles.nextLevel}>
          {nextLevelPoints - (overall.total_points || 0)} puntos para el
          siguiente nivel
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statValue}>{overall.total_sessions || 0}</div>
          <div className={styles.statLabel}>Sesiones</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>
            {overall.total_correct_answers || 0}
          </div>
          <div className={styles.statLabel}>Correctas</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statValue}>
            {Math.round(overall.average_accuracy || 0)}%
          </div>
          <div className={styles.statLabel}>Precisión</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statValue}>
            {Math.round((overall.total_time_spent || 0) / 60)}h
          </div>
          <div className={styles.statLabel}>Tiempo</div>
        </div>
      </div>

      {/* Modos de juego */}
      <div className={styles.gameModes}>
        <h3>🎮 Rendimiento por Modo</h3>
        <div className={styles.modesGrid}>
          {gameModes.map((mode) => (
            <div key={mode.game_mode} className={styles.modeCard}>
              <div className={styles.modeName}>
                {mode.game_mode === "survival"
                  ? "🏆 Supervivencia"
                  : "⚡ Ráfaga"}
              </div>
              <div className={styles.modeStats}>
                <span>{mode.total_sessions} sesiones</span>
                <span>{Math.round(mode.average_accuracy)}% precisión</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente para la pestaña de Sesiones
const SessionsTab = ({ sessions }) => (
  <div className={styles.sessions}>
    <h3>📈 Historial de Sesiones</h3>
    {sessions.length === 0 ? (
      <div className={styles.noData}>Aún no has completado sesiones</div>
    ) : (
      <div className={styles.sessionsList}>
        {sessions.map((session) => (
          <div key={session.id} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <span className={styles.sessionTheme}>{session.theme}</span>
              <span className={styles.sessionMode}>
                {session.game_mode === "survival" ? "🏆" : "⚡"}
              </span>
            </div>
            <div className={styles.sessionStats}>
              <span>{session.points_earned} puntos</span>
              <span>{Math.round(session.accuracy)}% precisión</span>
              <span>{Math.round(session.time_spent / 60)}min</span>
            </div>
            <div className={styles.sessionDate}>
              {new Date(session.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Componente para la pestaña de Temas
const ThemesTab = ({ themes }) => (
  <div className={styles.themes}>
    <h3>📚 Progreso por Temas</h3>
    {themes.length === 0 ? (
      <div className={styles.noData}>Aún no tienes datos por temas</div>
    ) : (
      <div className={styles.themesList}>
        {themes.map((theme) => (
          <div key={theme.theme} className={styles.themeCard}>
            <div className={styles.themeHeader}>
              <span className={styles.themeName}>{theme.theme}</span>
              <span className={styles.themeAccuracy}>
                {Math.round(theme.average_accuracy)}%
              </span>
            </div>
            <div className={styles.accuracyBar}>
              <div
                className={styles.accuracyFill}
                style={{ width: `${theme.average_accuracy}%` }}
              />
            </div>
            <div className={styles.themeStats}>
              <span>{theme.total_sessions} sesiones</span>
              <span>{theme.total_points} puntos</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Componente para la pestaña de Logros
const AchievementsTab = ({ achievements }) => (
  <div className={styles.achievements}>
    <h3>🏅 Tus Logros</h3>
    {achievements.length === 0 ? (
      <div className={styles.noData}>Aún no has desbloqueado logros</div>
    ) : (
      <div className={styles.achievementsGrid}>
        {achievements.map((achievement) => (
          <div key={achievement.id} className={styles.achievementCard}>
            <div className={styles.achievementIcon}>⭐</div>
            <div className={styles.achievementInfo}>
              <div className={styles.achievementName}>
                {achievement.achievement_name}
              </div>
              <div className={styles.achievementDesc}>
                {achievement.achievement_description}
              </div>
            </div>
            <div className={styles.achievementDate}>
              {new Date(achievement.achieved_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Componente principal
const MetricsDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState({
    overall: null,
    sessions: [],
    achievements: [],
    themes: [],
    timeline: [],
    gameModes: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Usar useCallback para evitar el warning de dependencias
  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);

      const [
        overallRes,
        sessionsRes,
        achievementsRes,
        themesRes,
        timelineRes,
        gameModesRes,
      ] = await Promise.all([
        fetch(`${METRICS_API_BASE}/user/${user.id}/metrics/overall`),
        fetch(`${METRICS_API_BASE}/user/${user.id}/metrics/sessions`),
        fetch(`${METRICS_API_BASE}/user/${user.id}/metrics/achievements`),
        fetch(`${METRICS_API_BASE}/user/${user.id}/metrics/themes`),
        fetch(`${METRICS_API_BASE}/user/${user.id}/metrics/timeline?days=30`),
        fetch(`${METRICS_API_BASE}/user/${user.id}/metrics/game-modes`),
      ]);

      if (!overallRes.ok) throw new Error("Error fetching overall metrics");
      if (!sessionsRes.ok) throw new Error("Error fetching sessions metrics");
      if (!achievementsRes.ok)
        throw new Error("Error fetching achievements metrics");
      if (!themesRes.ok) throw new Error("Error fetching themes metrics");
      if (!timelineRes.ok) throw new Error("Error fetching timeline metrics");
      if (!gameModesRes.ok)
        throw new Error("Error fetching game modes metrics");
      const overallData = await overallRes.json();
      const sessionsData = await sessionsRes.json();
      const achievementsData = await achievementsRes.json();
      const themesData = await themesRes.json();
      const timelineData = await timelineRes.json();
      const gameModesData = await gameModesRes.json();

      setMetrics({
        overall: overallData,
        sessions: sessionsData,
        achievements: achievementsData,
        themes: themesData,
        timeline: timelineData,
        gameModes: gameModesData,
      });
    } catch (error) {
      console.error("Error loading metrics:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]); // Dependencia correcta

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]); // Ahora loadMetrics es estable

  if (loading) {
    return <div className={styles.loading}>Cargando tus métricas...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* Header con navegación */}
      <div className={styles.header}>
        <h1>📊 Tu Progreso</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "overview" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Resumen
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "sessions" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("sessions")}
          >
            Sesiones
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "themes" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("themes")}
          >
            Temas
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "achievements" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            Logros
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.content}>
        {activeTab === "overview" && <OverviewTab metrics={metrics} />}
        {activeTab === "sessions" && (
          <SessionsTab sessions={metrics.sessions} />
        )}
        {activeTab === "themes" && <ThemesTab themes={metrics.themes} />}
        {activeTab === "achievements" && (
          <AchievementsTab achievements={metrics.achievements} />
        )}
      </div>
    </div>
  );
};

export default MetricsDashboard;
