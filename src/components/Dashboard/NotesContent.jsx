// components/GenerateFromNotes/NotesContent.jsx
import React, { useState } from "react";
import styles from "./NotesContent.module.css";
import { generateFromNotes } from "../../services/apiService";
import ChallengeResolver from "./ChallengeResolver";

const NotesContent = ({ user }) => {
  const [formData, setFormData] = useState({
    notes: "",
    theme: "",
    level: "intermedio",
    scheduleType: "immediate",
    deliveryDate: "",
    deliveryTime: "09:00",
    frequency: "once",
  });
  const [loading, setLoading] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      notes: "",
      theme: "",
      level: "intermedio",
      scheduleType: "immediate",
      deliveryDate: "",
      deliveryTime: "09:00",
      frequency: "once",
    });
  };

  const isFormValid = () => {
    if (!formData.notes.trim() || !formData.theme.trim()) {
      alert("Por favor ingresa tus apuntes y un tema");
      return false;
    }

    if (formData.scheduleType === "scheduled") {
      if (!formData.deliveryDate || !formData.deliveryTime) {
        alert("Por favor completa la fecha y hora de entrega");
        return false;
      }
    }

    return true;
  };

  const handleGenerateImmediate = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const result = await generateFromNotes({
        userId: user.id,
        notes: formData.notes,
        theme: formData.theme,
        level: formData.level,
        preferences: {
          scheduleType: "immediate",
          frequency: "once",
          isActive: false,
        },
      });

      if (result.question) {
        const immediateChallenge = {
          id: `immediate-${Date.now()}`,
          theme: formData.theme,
          level: formData.level,
          question: result.question.questionText,
          options: result.question.options,
          correct_answer: result.question.correctAnswer,
          frequency: "once",
          created_at: new Date().toISOString(),
        };

        setCurrentChallenge(immediateChallenge);
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert(
        `❌ Error: ${error.message || "Error al generar el reto desde apuntes"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChallenge = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const result = await generateFromNotes({
        userId: user.id,
        notes: formData.notes,
        theme: formData.theme,
        level: formData.level,
        preferences: {
          scheduleType: "scheduled",
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          frequency: formData.frequency,
          isActive: true,
        },
      });

      resetForm();
      alert(
        `✅ Reto programado para el ${formData.deliveryDate} a las ${formData.deliveryTime}`
      );
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message || "Error al programar el reto"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeComplete = () => {
    setCurrentChallenge(null);
  };

  // Renderizar ChallengeResolver si hay un reto inmediato
  if (currentChallenge) {
    return (
      <div className={styles.container}>
        <ChallengeResolver
          challenge={currentChallenge}
          onComplete={handleChallengeComplete}
        />
      </div>
    );
  }

  // Renderizar el formulario normal si no hay reto activo
  return (
    <div className={styles.container}>
      <h3>🤖 Generar Reto desde Apuntes (IA)</h3>

      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label>Tema principal:</label>
          <input
            type="text"
            name="theme"
            value={formData.theme}
            onChange={handleInputChange}
            placeholder="Ej: Segunda Guerra Mundial, Funciones en Python..."
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nivel:</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
          >
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Tus apuntes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Pega aquí el contenido de tus apuntes, notas de clase, resúmenes..."
            rows="6"
            required
          />
          <small>
            La IA analizará este texto y generará una pregunta tipo test
          </small>
        </div>

        <div className={styles.schedulingSection}>
          <h4>⏰ Programar Entrega</h4>

          <div className={styles.formGroup}>
            <label>Tipo de entrega:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="scheduleType"
                  value="immediate"
                  checked={formData.scheduleType === "immediate"}
                  onChange={handleInputChange}
                />
                📋 Generar para resolver ahora
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="scheduleType"
                  value="scheduled"
                  checked={formData.scheduleType === "scheduled"}
                  onChange={handleInputChange}
                />
                🗓️ Programar entrega automática
              </label>
            </div>
          </div>

          {formData.scheduleType === "scheduled" && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Fecha de entrega:</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Hora:</label>
                  <input
                    type="time"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Frecuencia:</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                >
                
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className={styles.actions}>
          {formData.scheduleType === "immediate" ? (
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleGenerateImmediate}
              disabled={
                loading || !formData.notes.trim() || !formData.theme.trim()
              }
            >
              {loading ? "🤖 Generando..." : "🚀 Generar para Resolver Ahora"}
            </button>
          ) : (
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleScheduleChallenge}
              disabled={
                loading ||
                !formData.notes.trim() ||
                !formData.theme.trim() ||
                !formData.deliveryDate ||
                !formData.deliveryTime
              }
            >
              {loading ? "🗓️ Programando..." : "🗓️ Programar Reto"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NotesContent;
