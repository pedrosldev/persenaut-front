// src/components/Dashboard/SettingsContent/SettingsContent.jsx
import { useState } from "react";
import styles from "./SettingsContent.module.css";

const SettingsContent = ({ user }) => {
  const [settings, setSettings] = useState({
    username: user.name,
    email: user.email,
    notifications: "Activadas",
    goals: 5,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...settings });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setSettings({ ...tempSettings });
    setIsEditing(false);
    // Aquí normalmente harías una llamada a la API para guardar los cambios
    alert("Configuración guardada correctamente");
  };

  const handleCancel = () => {
    setTempSettings({ ...settings });
    setIsEditing(false);
  };

  return (
    <>
      <header className={styles.contentHeader}>
        <h2>Configuración</h2>
        {isEditing ? (
          <div className={styles.headerActions}>
            <button className={styles.btnSecondary} onClick={handleCancel}>
              Cancelar
            </button>
            <button className={styles.btnPrimary} onClick={handleSave}>
              Guardar cambios
            </button>
          </div>
        ) : (
          <button
            className={styles.btnPrimary}
            onClick={() => setIsEditing(true)}
          >
            Editar configuración
          </button>
        )}
      </header>
      <div className={styles.content}>
        <div className={styles.settingsForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={tempSettings.username}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={tempSettings.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="notifications">Notificaciones</label>
            <select
              id="notifications"
              name="notifications"
              value={tempSettings.notifications}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="Activadas">Activadas</option>
              <option value="Desactivadas">Desactivadas</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="goals">Objetivos diarios</label>
            <input
              type="number"
              id="goals"
              name="goals"
              value={tempSettings.goals}
              onChange={handleInputChange}
              min="1"
              max="20"
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className={styles.formActions}>
              <button className={styles.btnSecondary} onClick={handleCancel}>
                Cancelar
              </button>
              <button className={styles.btnPrimary} onClick={handleSave}>
                Guardar cambios
              </button>
            </div>
          )}
        </div>

        <div className={styles.accountSection}>
          <h3>Zona de peligro</h3>
          <div className={styles.dangerZone}>
            <p>Estas acciones son irreversibles. Procede con precaución.</p>
            <button className={styles.btnDanger}>Eliminar mi cuenta</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsContent;
