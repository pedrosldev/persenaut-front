// src/components/Dashboard/DashboardContent/DashboardContent.jsx
import { useState } from "react";
import styles from "./DashboardContent.module.css";

const DashboardContent = () => {
  const [activeInfo, setActiveInfo] = useState("progress");

  const handleCardClick = (target) => {
    setActiveInfo(target);
  };

  return (
    <>
      <header className={styles.contentHeader}>
        <h2>¡Tú puedes lograrlo!</h2>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar..." />
        </div>
      </header>
      <div className={styles.content}>
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

        <div className={styles.dashboardInfo}>
          <div
            className={styles.infoSection}
            style={{ display: activeInfo === "progress" ? "block" : "none" }}
          >
            <h3>Tu progreso semanal</h3>
            <p>
              Has completado el 65% de tus objetivos esta semana. ¡Sigue así!
            </p>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: "65%" }}></div>
            </div>
          </div>

          <div
            className={styles.infoSection}
            style={{ display: activeInfo === "activity" ? "block" : "none" }}
          >
            <h3>Actividad reciente</h3>
            <ul>
              <li>Completaste 5 tareas ayer</li>
              <li>Nuevo récord: 3 días consecutivos</li>
              <li>Logro "Consistencia" desbloqueado</li>
            </ul>
          </div>

          <div
            className={styles.infoSection}
            style={{
              display: activeInfo === "achievements" ? "block" : "none",
            }}
          >
            <h3>Logros desbloqueados</h3>
            <div className={styles.badges}>
              <div className={styles.badge}>🏆 Primer paso</div>
              <div className={styles.badge}>⭐ 3 días seguidos</div>
              <div className={styles.badge}>🚀 Productividad</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
