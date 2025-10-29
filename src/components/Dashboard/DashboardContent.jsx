// src/components/Dashboard/DashboardContent/DashboardContent.jsx
import { useState } from "react";
import styles from "./DashboardContent.module.css";
import NotificationsPanel from "./NotificationsPanel";
import ChallengeResolver from "./ChallengeResolver";
import TutorPanel from "../TutorPanel.jsx/TutorPanel";

const DashboardContent = ({ user }) => {
  const [activeInfo, setActiveInfo] = useState("progress");
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const handleCardClick = (target) => {
    setActiveInfo(target);
  };
  const handleChallengeSelect = (challenge) => {
    setCurrentChallenge(challenge);
  };
  const handleChallengeComplete = () => {
    setCurrentChallenge(null);
    // Recargar notificaciones si es necesario
  };
  return (
    <>
      <header className={styles.contentHeader}>
        <h2>¡Tú puedes lograrlo {user.name}!</h2>
        <NotificationsPanel
          user={user}
          onChallengeSelect={handleChallengeSelect}
        />
        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar..." />
        </div>
      </header>
      <div className={styles.content}>
        {currentChallenge ? (
          <ChallengeResolver
            challenge={currentChallenge}
            onComplete={handleChallengeComplete}
            userId={user.id}
          />
        ) : (
          <div>
            <div className={styles.cardsContainer}>
              <div
                className={`${styles.card} ${
                  activeInfo === "progress" ? styles.selected : ""
                }`}
                onClick={() => handleCardClick("progress")}
              >
                <h4>Estadísticas de progreso</h4>
                <p>Ver tu evolución y métricas</p>
              </div>
              <div
                className={`${styles.card} ${
                  activeInfo === "activity" ? styles.selected : ""
                }`}
                onClick={() => handleCardClick("activity")}
              >
                <h4>Actividad reciente</h4>
                <p>Tu historial de acciones</p>
              </div>
              <div
                className={`${styles.card} ${
                  activeInfo === "achievements" ? styles.selected : ""
                }`}
                onClick={() => handleCardClick("achievements")}
              >
                <h4>Logros desbloqueados</h4>
                <p>Tus conquistas y metas</p>
              </div>
            </div>

            <TutorPanel userId={user.id} />
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardContent;
