// src/components/Dashboard/NotesContent/NotesContent.jsx
import styles from "./NotesContent.module.css";

const NotesContent = ({ user }) => {
  return (
    <>
      <header className={styles.contentHeader}>
        <h2>Los apuntes de {user.name}</h2>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar apuntes..." />
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.notesGrid}>
          <div className={styles.noteCard}>
            <div className={styles.noteTitle}>Ideas para proyecto</div>
            <div className={styles.noteContent}>
              Investigar sobre técnicas de aprendizaje acelerado y cómo
              aplicarlas en el desarrollo profesional.
            </div>
            <div className={styles.noteDate}>12/05/2025</div>
          </div>
          {/* Más notas... */}
        </div>
        <button className={styles.btnPrimary}>Nuevo apunte</button>
      </div>
    </>
  );
};

export default NotesContent;
