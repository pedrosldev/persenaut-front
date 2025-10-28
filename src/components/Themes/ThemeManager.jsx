import { useState, useEffect } from "react";
import { themeService } from "../../services/themeService";
import styles from "./ThemeManager.module.css";

const ThemeManager = ({ userId }) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stats, setStats] = useState({ totalThemes: 0, totalQuestions: 0 });

  useEffect(() => {
    const loadUserThemes = async () => {
      try {
        const data = await themeService.getUserThemes(userId);
        if (data.success) {
          setThemes(data.themes);
          const totalQuestions = data.themes.reduce(
            (sum, theme) => sum + parseInt(theme.total_questions),
            0
          );
          setStats({
            totalThemes: data.themes.length,
            totalQuestions,
          });
        }
      } catch (error) {
        console.error("Error loading themes:", error);
        alert("Error al cargar los temas");
      } finally {
        setLoading(false);
      }
    };
    loadUserThemes();
  }, [userId]);

  // Función para obtener color según nivel
  const getLevelColor = (level) => {
    const colorMap = {
      Principiante: "#28a745",
      Intermedio: "#ffc107",
      Avanzado: "#dc3545",
    };
    return colorMap[level] || "#6c757d";
  };

  // ELIMINAR TEMA COMPLETO (SOLO TEMA)
  const handleDeleteTheme = async (theme) => {
    try {
      console.log("🎯 Eliminando tema completo:", theme);
      const result = await themeService.deleteTheme(theme, userId);

      // Actualizar estado - eliminar TODOS los registros de ese tema
      setThemes(themes.filter((t) => t.theme !== theme));
      setDeleteConfirm(null);

      setStats((prev) => ({
        totalThemes: prev.totalThemes - 1,
        totalQuestions: prev.totalQuestions - result.deletedQuestions,
      }));

      alert(
        `Tema "${theme}" eliminado completamente (${result.deletedQuestions} preguntas)`
      );
    } catch (error) {
      console.error("❌ Error eliminando tema:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSelectTheme = (theme) => {
    const newSelected = new Set(selectedThemes);
    if (newSelected.has(theme)) {
      newSelected.delete(theme);
    } else {
      newSelected.add(theme);
    }
    setSelectedThemes(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedThemes.size === 0) return;
    try {
      const themesToDelete = Array.from(selectedThemes);
      const result = await themeService.deleteMultipleThemes(
        themesToDelete,
        userId
      );

      setThemes(themes.filter((t) => !selectedThemes.has(t.theme)));
      setSelectedThemes(new Set());

      setStats((prev) => ({
        totalThemes: prev.totalThemes - themesToDelete.length,
        totalQuestions: prev.totalQuestions - result.deletedQuestions,
      }));

      alert(
        `${themesToDelete.length} temas eliminados (${result.deletedQuestions} preguntas)`
      );
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  if (loading) {
    return <div className={styles.loading}>Cargando temas...</div>;
  }

  return (
    <div className={styles.themeManager}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3>Gestionar Temas de Repaso</h3>
          <div className={styles.stats}>
            <span className={styles.stat}>{stats.totalThemes} temas</span>
            <span className={styles.stat}>
              {stats.totalQuestions} preguntas
            </span>
          </div>
        </div>

        {selectedThemes.size > 0 && (
          <button
            className={styles.deleteSelectedBtn}
            onClick={handleDeleteSelected}
          >
            Eliminar {selectedThemes.size} Temas Seleccionados
          </button>
        )}
      </div>

      <div className={styles.themesGrid}>
        {themes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tienes temas de repaso activos</p>
            <p className={styles.emptySubtitle}>
              Los temas aparecerán aquí cuando generes preguntas de repaso
            </p>
          </div>
        ) : (
          themes.map((theme) => (
            <div
              key={`${theme.theme}-${theme.level}`}
              className={styles.themeCard}
            >
              <div className={styles.themeHeader}>
                <input
                  type="checkbox"
                  checked={selectedThemes.has(theme.theme)}
                  onChange={() => handleSelectTheme(theme.theme)}
                  className={styles.checkbox}
                />

                <div className={styles.themeInfo}>
                  <h4 className={styles.themeName}>{theme.theme}</h4>
                  <div className={styles.themeMeta}>
                    <span
                      className={styles.level}
                      style={{ backgroundColor: getLevelColor(theme.level) }}
                    >
                      {theme.level}
                    </span>
                    <span className={styles.questions}>
                      {theme.total_questions} preguntas
                    </span>
                  </div>
                </div>

                <button
                  className={styles.deleteBtn}
                  onClick={() => setDeleteConfirm(theme.theme)}
                  title="Eliminar este tema y TODAS sus preguntas"
                >
                  🗑️
                </button>
              </div>

              <div className={styles.dates}>
                <span>Desde: {formatDate(theme.first_created)}</span>
                <span>Última: {formatDate(theme.last_created)}</span>
              </div>

              {deleteConfirm === theme.theme && (
                <div className={styles.confirmDelete}>
                  <div className={styles.warningIcon}>⚠️</div>
                  <div className={styles.confirmText}>
                    <p>
                      <strong>
                        ¿Eliminar tema "{theme.theme}" COMPLETAMENTE?
                      </strong>
                    </p>
                    <p>
                      Se eliminarán TODAS las preguntas de este tema en todos
                      los niveles.
                    </p>
                    <p className={styles.warning}>
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                  <div className={styles.confirmActions}>
                    <button
                      className={styles.confirmYes}
                      onClick={() => handleDeleteTheme(theme.theme)}
                    >
                      Sí, eliminar todo
                    </button>
                    <button
                      className={styles.confirmNo}
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThemeManager;
