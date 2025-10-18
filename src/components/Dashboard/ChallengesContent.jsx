import { useState } from "react";
import styles from "./ChallengesContent.module.css";
import QuestionForm from "../QuestionForm";
import { useQuestionHistory } from "../../hooks/useQuestionHistory"; // ✅ Añadir hook
import { generateAndSaveQuestion } from "../../services/apiService";

const ChallengesContent = ({ user }) => {
  const [challenges, setChallenges] = useState([]);

  const [questionHistory, updateHistory] = useQuestionHistory(); // ✅ Usar el hook
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    deadline: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSaveQuestion = async (formDataWithPreferences) => {
    const { tematica, nivel, preferences = {} } = formDataWithPreferences;
    const {
      deliveryTime = "09:00:00",
      frequency = "daily",
      isActive = true,
    } = preferences;

    if (!tematica || !nivel) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const previousQuestions = questionHistory.get(tematica) || [];

      // ✅ SOLO UNA LLAMADA al backend que hace todo
      const result = await generateAndSaveQuestion({
        theme: tematica,
        level: nivel,
        previousQuestions: previousQuestions,
        userId: user.id,
        preferences: {
          deliveryTime,
          frequency,
          isActive,
        },
      });

      // ✅ Actualizar historial
      updateHistory(tematica, result.rawResponse);

      console.log("✅ Pregunta generada y guardada:", result.savedQuestionId);

      alert(
        `✅ Pregunta generada y programada!\n📅 Se entregará ${frequency}mente a las ${deliveryTime.substring(
          0,
          5
        )}`
      );

      // ✅ Crear nuevo challenge para el estado local
      const newChallenge = {
        id: result.savedQuestionId,
        title: `Pregunta: ${tematica} (${nivel}) - ${result.question.questionText.substring(
          0,
          50
        )}...`,
        deadline: `Programado: ${frequency} a las ${deliveryTime.substring(
          0,
          5
        )}`,
        status: "pending",
        type: "scheduled_question",
        questionData: result.question,
        scheduleInfo: preferences,
      };

      setChallenges((prev) => [...prev, newChallenge]);
    } catch (error) {
      console.error("Error al guardar pregunta:", error);
      alert(`❌ Error: ${error.message || "Error al generar la pregunta"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChallenge = () => {
    if (newChallenge.title && newChallenge.deadline) {
      const challenge = {
        id: Date.now(),
        title: newChallenge.title,
        deadline: newChallenge.deadline,
        status: "pending",
        type: "custom",
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
                {challenge.type === "scheduled_question" && (
                  <span className={styles.scheduledBadge}>⏰ Programado</span>
                )}
                {challenge.type === "question" && (
                  <span className={styles.questionBadge}>
                    📝 Pregunta generada
                  </span>
                )}
                {challenge.type === "custom" && (
                  <span className={styles.customBadge}>⭐ Personalizado</span>
                )}
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

        {/* ✅ Sección para generar preguntas */}
        <div className={styles.section}>
          <h3>Generar preguntas automáticamente</h3>
          <QuestionForm onSubmit={handleSaveQuestion} loading={loading} />
        </div>

        {/* ✅ Formulario para retos personalizados */}
        {showForm ? (
          <div className={styles.challengeForm}>
            <h3>Crear nuevo reto personalizado</h3>
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
            Crear nuevo reto personalizado
          </button>
        )}
      </div>
    </>
  );
};

export default ChallengesContent;
