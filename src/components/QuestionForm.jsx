import React, { useState } from "react";
import styles from "./QuestionForm.module.css";

const QuestionForm = ({
  onSubmit,
  onTestGroq,
  loading = false,
  showPreferences = true, // ✅ Nueva prop para controlar visibilidad
}) => {
  const [formData, setFormData] = useState({ tematica: "", nivel: "" });

  const [preferences, setPreferences] = useState({
    deliveryTime: "09:00",
    frequency: "daily",
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      if (showPreferences) {
        // ✅ CON preferencias
        onSubmit({
          tematica: formData.tematica,
          nivel: formData.nivel,
          preferences: {
            deliveryTime: preferences.deliveryTime
              ? preferences.deliveryTime + ":00"
              : "09:00:00",
            frequency: preferences.frequency || "daily",
            isActive:
              preferences.isActive !== undefined ? preferences.isActive : true,
          },
        });
      } else {
        // ✅ SIN preferencias - solo datos básicos
        onSubmit({
          tematica: formData.tematica,
          nivel: formData.nivel,
        });
      }
    }
  };

  const handleTestClick = () => {
    if (onTestGroq) {
      onTestGroq(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="tematica">
          Temática de la Pregunta:
        </label>
        <input
          className={styles.input}
          type="text"
          id="tematica"
          name="tematica"
          placeholder="ej: JavaScript, matemáticas, historia..."
          value={formData.tematica}
          onChange={handleInputChange}
          required
          disabled={loading}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="nivel">
          Nivel de Dificultad:
        </label>
        <select
          className={styles.select}
          id="nivel"
          name="nivel"
          value={formData.nivel}
          onChange={handleInputChange}
          required
          disabled={loading}
        >
          <option value="">Selecciona un nivel</option>
          <option value="principiante">🟢 Principiante</option>
          <option value="intermedio">🟡 Intermedio</option>
          <option value="avanzado">🔴 Avanzado</option>
        </select>
      </div>

      {/* ✅ SECCIÓN DE PREFERENCIAS - CONDICIONAL */}
      {showPreferences && (
        <div className={styles.preferencesSection}>
          <h4>⏰ Preferencias de Entrega</h4>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="deliveryTime">
              Hora de entrega:
            </label>
            <input
              className={styles.input}
              type="time"
              id="deliveryTime"
              name="deliveryTime"
              value={preferences.deliveryTime}
              onChange={handlePreferenceChange}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="frequency">
              Frecuencia:
            </label>
            <select
              className={styles.select}
              id="frequency"
              name="frequency"
              value={preferences.frequency}
              onChange={handlePreferenceChange}
              disabled={loading}
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          {/*    <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isActive"
                checked={preferences.isActive}
                onChange={handlePreferenceChange}
                disabled={loading}
              />
              Activar entrega automática
            </label>
          </div> */}
        </div>
      )}

      <div className={styles.buttonGroup}>
        {onSubmit && (
          <button
            type="submit"
            className={`${styles.btn} ${styles.primaryBtn} ${
              loading ? styles.btnDisabled : ""
            }`}
            disabled={loading || !formData.tematica || !formData.nivel}
          >
            {showPreferences
              ? "🚀 Generar y Programar Pregunta"
              : "🚀 Generar Pregunta"}
          </button>
        )}

        {onTestGroq && (
          <button
            type="button"
            className={`${styles.btn} ${styles.secondaryBtn} ${
              loading ? styles.btnDisabled : ""
            }`}
            onClick={handleTestClick}
            disabled={loading}
          >
            Test Groq API
          </button>
        )}
      </div>
    </form>
  );
};

export default QuestionForm;
