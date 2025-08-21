import React, { useState } from 'react';
import styles from './Demo.module.css'; // módulo CSS para este componente

export default function Demo() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Lógica de llamada al backend para generar la pregunta
    // Ejemplo:
    // fetch('/api/reto', {...})
    //   .then(res => res.json())
    //   .then(data => setQuestion(data.reto))
    //   .finally(() => setLoading(false));
  };

  return (
    <div className={styles.container}>
      <h1>📝 PERSENAUT</h1>
      <div className={styles.demoBanner}>
        <p>
          🔐 Esta es una versión demo. <a href="/register">Regístrate</a> para desbloquear:
        </p>
        <ul>
          <li>✔️ Historial de preguntas</li>
          <li>✔️ Guardar tus favoritas</li>
          <li>✔️ Automatización de la frecuencia de los retos</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className={styles.retoForm}>
        <div className={styles.formGroup}>
          <label htmlFor="tematica">Temática de la Pregunta:</label>
          <input type="text" id="tematica" name="tematica" placeholder="ej: JavaScript, matemáticas, historia..." required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nivel">Nivel de Dificultad:</label>
          <select id="nivel" name="nivel" required>
            <option value="">Selecciona un nivel</option>
            <option value="principiante">🟢 Principiante</option>
            <option value="intermedio">🟡 Intermedio</option>
            <option value="avanzado">🔴 Avanzado</option>
          </select>
        </div>

        <button type="submit" className={styles.btn}>
          🚀 Generar Pregunta
        </button>
      </form>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Generando tu pregunta personalizada...</p>
        </div>
      )}

      {question && (
        <div className={styles.result}>
          <h3>¡Tu pregunta está lista! 📝</h3>
          <div className={styles.questionContent}>{question}</div>
        </div>
      )}
    </div>
  );
}
