// src/components/Dashboard/ChallengesContent/ChallengesContent.jsx
import { useState } from "react";
import styles from "./ChallengesContent.module.css";

const ChallengesContent = () => {
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Reto de lectura",
      deadline: "25/05/2025",
      status: "pending",
    },
    {
      id: 2,
      title: "Ejercicio matutino",
      deadline: "20/05/2025",
      status: "completed",
    },
    {
      id: 3,
      title: "Aprendizaje de nuevo skill",
      deadline: "30/05/2025",
      status: "pending",
    },
  ]);

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    deadline: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddChallenge = () => {
    if (newChallenge.title && newChallenge.deadline) {
      const challenge = {
        id: Date.now(),
        title: newChallenge.title,
        deadline: newChallenge.deadline,
        status: "pending",
      };

      setChallenges((prev) => [...prev, challenge]);
      setNewChallenge({ title: "", deadline: "" });
      setShowForm(false);
    }
  };

  const toggleChallengeStatus = (id) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === id
          ? {
              ...challenge,
              status: challenge.status === "pending" ? "completed" : "pending",
            }
          : challenge
      )
    );
  };

  return (
    <>
      <header className={styles.contentHeader}>
        <h2>Programar retos</h2>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar retos..." />
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.challengeList}>
          {challenges.map((challenge) => (
            <div key={challenge.id} className={styles.challengeItem}>
              <div className={styles.challengeInfo}>
                <h3>{challenge.title}</h3>
                <div className={styles.challengeDate}>
                  Fecha límite: {challenge.deadline}
                </div>
              </div>
              <div
                className={`${styles.challengeStatus} ${
                  challenge.status === "completed"
                    ? styles.statusCompleted
                    : styles.statusPending
                }`}
                onClick={() => toggleChallengeStatus(challenge.id)}
              >
                {challenge.status === "completed" ? "Completado" : "Pendiente"}
              </div>
            </div>
          ))}
        </div>

        {showForm ? (
          <div className={styles.challengeForm}>
            <h3>Crear nuevo reto</h3>
            <div className={styles.formGroup}>
              <label htmlFor="title">Título del reto</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newChallenge.title}
                onChange={handleInputChange}
                placeholder="Ej: Leer 30 minutos al día"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="deadline">Fecha límite</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={newChallenge.deadline}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleAddChallenge}
              >
                Crear reto
              </button>
            </div>
          </div>
        ) : (
          <button
            className={styles.btnPrimary}
            onClick={() => setShowForm(true)}
          >
            Crear nuevo reto
          </button>
        )}
      </div>
    </>
  );
};

export default ChallengesContent;
