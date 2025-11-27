// src/components/Dashboard/SettingsContent/SettingsContent.jsx
import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../../services/profileService";
import styles from "./SettingsContent.module.css";

const SettingsContent = ({ user, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar perfil al montar el componente
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (error) {
      showMessage("error", "Error al cargar el perfil");
      // Usar datos del user prop como fallback
      setProfile({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profile);
      setIsEditing(false);
      showMessage("success", "Perfil actualizado correctamente");
      if (onProfileUpdate) {
        onProfileUpdate(profile);
      }
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      showMessage("success", "Contraseña cambiada correctamente");
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showMessage("error", "Por favor ingresa tu contraseña para confirmar");
      return;
    }

    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y se perderán todos tus datos."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteAccount(deletePassword);
      showMessage("success", "Cuenta eliminada correctamente");
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    loadProfile(); // Recargar datos originales
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setDeletePassword("");
  };

  return (
    <>
      <header className={styles.contentHeader}>
        <h2>Configuración del Perfil</h2>
        {isEditing ? (
          <div className={styles.headerActions}>
            <button
              className={styles.btnSecondary}
              onClick={cancelEditing}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              className={styles.btnPrimary}
              onClick={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        ) : (
          <button
            className={styles.btnPrimary}
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            Editar perfil
          </button>
        )}
      </header>

      <div className={styles.content}>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Información Personal */}
        <div className={styles.section}>
          <h3>Información Personal</h3>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              disabled={!isEditing || isLoading}
              placeholder="Tu nombre completo"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              disabled={!isEditing || isLoading}
              placeholder="Nombre de usuario único"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              disabled={!isEditing || isLoading}
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Cambio de Contraseña */}
        <div className={styles.section}>
          <h3>Seguridad</h3>

          {!isChangingPassword ? (
            <button
              className={styles.btnSecondary}
              onClick={() => setIsChangingPassword(true)}
              disabled={isLoading}
            >
              Cambiar contraseña
            </button>
          ) : (
            <div className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Contraseña actual</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="Repite la nueva contraseña"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  className={styles.btnSecondary}
                  onClick={cancelPasswordChange}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? "Cambiando..." : "Cambiar contraseña"}
                </button>
              </div>
            </div>
          )}

          {/* Nota sobre restablecimiento de contraseña */}
          <div className={styles.infoNote}>
            <p>
              ¿Olvidaste tu contraseña? El sistema de restablecimiento por email
              estará disponible próximamente.
            </p>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className={styles.dangerSection}>
          <h3>Zona de Peligro</h3>
          <div className={styles.dangerZone}>
            <p>
              <strong>Advertencia:</strong> Estas acciones son irreversibles. Al
              eliminar tu cuenta, se perderán permanentemente todos tus datos,
              progreso y estadísticas.
            </p>

            {!isDeleting ? (
              <button
                className={styles.btnDanger}
                onClick={() => setIsDeleting(true)}
                disabled={isLoading}
              >
                Eliminar mi cuenta
              </button>
            ) : (
              <div className={styles.deleteForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="deletePassword">
                    Para confirmar la eliminación, ingresa tu contraseña:
                  </label>
                  <input
                    type="password"
                    id="deletePassword"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Tu contraseña actual"
                  />
                </div>
                <div className={styles.formActions}>
                  <button
                    className={styles.btnSecondary}
                    onClick={cancelDelete}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.btnDanger}
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? "Eliminando..." : "Confirmar eliminación"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsContent;
