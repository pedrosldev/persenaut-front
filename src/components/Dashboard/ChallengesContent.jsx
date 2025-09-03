import { useState } from "react";
import styles from "./ChallengesContent.module.css";
import QuestionForm from "../QuestionForm";
import { useQuestionHistory } from "../hooks/useQuestionHistory"; // ✅ Añadir hook
import { generatePrompt, formatQuestion } from "../../services/promptService"; // ✅ Usar formatQuestion
import { fetchChallenge, saveQuestionToDB } from "../../services/apiService";

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

  // ✅ Función mejorada para guardar preguntas en BD
  const handleSaveQuestion = async (formData) => {
    if (!formData.tematica || !formData.nivel) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      // ✅ Usar questionHistory para evitar repeticiones
      const previousQuestions = questionHistory.get(formData.tematica) || [];
      const prompt = generatePrompt(
        formData.tematica,
        formData.nivel,
        previousQuestions
      );
      const responseText = await fetchChallenge(prompt);

      // ✅ Usar formatQuestion en lugar de objeto hardcodeado
      const formatted = formatQuestion(responseText);

      // ✅ Actualizar historial para evitar preguntas repetidas
      updateHistory(formData.tematica, responseText);

      const saveResult = await saveQuestionToDB(
        formatted,
        formData.tematica,
        formData.nivel,
        responseText
      );

      console.log("✅ Pregunta guardada con ID:", saveResult.id);
      alert(`✅ Pregunta guardada en BD con ID: ${saveResult.id}`);

      // ✅ Usar la pregunta real formateada en lugar de texto genérico
      const newChallenge = {
        id: saveResult.id,
        title: `Pregunta: ${formData.tematica} (${
          formData.nivel
        }) - ${formatted.questionText.substring(0, 50)}...`,
        deadline: new Date().toLocaleDateString(),
        status: "pending",
        type: "question",
        questionData: formatted, // ✅ Guardar datos completos para uso futuro
      };

      setChallenges((prev) => [...prev, newChallenge]);
    } catch (error) {
      console.error("Error al guardar pregunta:", error);
      alert(`❌ Error: ${error.message || "Error al guardar la pregunta"}`);
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
