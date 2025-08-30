import React, { useState } from "react";
import styles from "./QuestionForm.module.css";

const QuestionForm = ({ onSubmit, onTestGroq, loading = false }) => {
  const [formData, setFormData] = useState({ tematica: "", nivel: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
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

      <div className={styles.buttonGroup}>
        {
            onSubmit && (<button
              type="submit"
              className={`${styles.btn} ${styles.primaryBtn} ${
                loading ? styles.btnDisabled : ""
              }`}
              disabled={loading || !formData.tematica || !formData.nivel}
            >
              🚀 Generar Pregunta
            </button>)
        }

        {
            onTestGroq && (
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
            )
        }
      </div>
    </form>
  );
};

export default QuestionForm;
