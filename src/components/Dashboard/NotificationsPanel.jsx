// components/NotificationsPanel/NotificationsPanel.jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./NotificationsPanel.module.css";
import {
  getPendingChallenges,
  startChallenge,
} from "../../services/notificationService";

const NotificationsPanel = ({ user, onChallengeSelect }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // ✅ useCallback para memoizar la función
  const loadPendingChallenges = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await getPendingChallenges(user.id);
      setNotifications(result.challenges || []);
    } catch (error) {
      console.error("Error loading challenges:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // ✅ Dependencia: user.id

  // ✅ Cargar notificaciones cuando el componente se monta o el usuario cambia
  useEffect(() => {
    if (user) {
      loadPendingChallenges();
    }
  }, [user, loadPendingChallenges]); // ✅ Carga automáticamente

  // ✅ Opcional: Recargar cuando se abre el panel también
  useEffect(() => {
    if (user && showPanel) {
      loadPendingChallenges();
    }
  }, [user, showPanel, loadPendingChallenges]);

  const handleStartChallenge = async (challenge) => {
    try {
      // Actualizar estado a "active" en backend
      await startChallenge(challenge.id);

      // Pasar el reto al componente padre para resolverlo
      onChallengeSelect(challenge);

      // Remover de notificaciones
      setNotifications((prev) => prev.filter((n) => n.id !== challenge.id));
      setShowPanel(false);
    } catch (error) {
      console.error("Error starting challenge:", error);
      alert("Error al iniciar el reto");
    }
  };

  const getNotificationIcon = (challenge) => {
    switch (challenge.level) {
      case "principiante":
        return "🟢";
      case "intermedio":
        return "🟡";
      case "avanzado":
        return "🔴";
      default:
        return "📝";
    }
  };

  return (
    <div className={styles.notificationsContainer}>
      {/* Botón/Icono de notificaciones */}
      <button
        className={styles.notificationsButton}
        onClick={() => setShowPanel(!showPanel)}
      >
        🔔 Retos Pendientes
        {notifications.length > 0 && (
          <span className={styles.notificationBadge}>
            {notifications.length}
          </span>
        )}
      </button>

      {/* Panel desplegable */}
      {showPanel && (
        <div className={styles.notificationsPanel}>
          <div className={styles.panelHeader}>
            <h3>Tus Retos Pendientes</h3>
            <button
              className={styles.closeButton}
              onClick={() => setShowPanel(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.notificationsList}>
            {loading ? (
              <div className={styles.loading}>Cargando retos...</div>
            ) : notifications.length === 0 ? (
              <div className={styles.emptyState}>
                🎉 No tienes retos pendientes
              </div>
            ) : (
              notifications.map((challenge) => (
                <div key={challenge.id} className={styles.notificationItem}>
                  <div className={styles.notificationContent}>
                    <div className={styles.challengeHeader}>
                      <span className={styles.levelIcon}>
                        {getNotificationIcon(challenge)}
                      </span>
                      <span className={styles.theme}>{challenge.theme}</span>
                      <span className={styles.level}>({challenge.level})</span>
                    </div>
                    <div className={styles.challengeMeta}>
                      <span className={styles.date}>
                        📅 {new Date(challenge.created_at).toLocaleDateString()}
                      </span>
                      {challenge.frequency && (
                        <span className={styles.frequency}>
                          🔄 {challenge.frequency}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className={styles.startButton}
                    onClick={() => handleStartChallenge(challenge)}
                  >
                    🚀 Resolver
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;