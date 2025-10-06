// components/GenerateFromNotes/NotesContent.jsx
import React, { useState } from "react";
import styles from "./NotesContent.module.css";
import { generateFromNotes } from "../../services/apiService"; // ✅ Importar el servicio

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.notes || !formData.theme) {
      alert("Por favor ingresa tus apuntes y un tema");
      return;
    }

    setLoading(true);
    try {
      // ✅ USAR EL SERVICIO API EN LUGAR DE FETCH DIRECTAMENTE
      const result = await generateFromNotes({
        userId: user.id,
        notes: formData.notes,
        theme: formData.theme,
        level: formData.level,
        preferences: {
          scheduleType: formData.scheduleType,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          frequency: formData.frequency,
          isActive: formData.scheduleType === "scheduled",
        },
      });

      // Reset form
      setFormData({
        notes: "",
        theme: "",
        level: "intermedio",
        scheduleType: "immediate",
        deliveryDate: "",
        deliveryTime: "09:00",
        frequency: "once",
      });

     

      const message =
        formData.scheduleType === "immediate"
          ? "✅ Reto generado correctamente"
          : `✅ Reto programado para el ${formData.deliveryDate} a las ${formData.deliveryTime}`;
      alert(message);
    } catch (error) {
      console.error("Error:", error);
      alert(
        `❌ Error: ${error.message || "Error al generar el reto desde apuntes"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ... (el resto del JSX se mantiene igual)
  return (
    <div className={styles.container}>
      <h3>🤖 Generar Reto desde Apuntes (IA)</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
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
                  <option value="once">Una sola vez</option>
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !formData.notes.trim()}
        >
          {loading ? "🤖 Generando..." : "🚀 Generar Reto con IA"}
        </button>
      </form>
    </div>
  );
};

export default NotesContent;
