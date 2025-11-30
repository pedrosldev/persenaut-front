// src/hooks/usePasswordChange.js
import { useState } from 'react';
import { changePassword } from '../services/profileService';

/**
 * Hook para manejar el cambio de contraseña
 * @returns {object} - Estado y funciones para cambio de contraseña
 */
export const usePasswordChange = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Validar contraseñas
  const validatePasswords = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { valid: false, error: 'Todos los campos son requeridos' };
    }

    if (newPassword.length < 6) {
      return { valid: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }

    if (newPassword !== confirmPassword) {
      return { valid: false, error: 'Las contraseñas no coinciden' };
    }

    if (currentPassword === newPassword) {
      return { valid: false, error: 'La nueva contraseña debe ser diferente a la actual' };
    }

    return { valid: true };
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    const validation = validatePasswords();
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Limpiar formulario
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);

      return { success: true, message: 'Contraseña cambiada correctamente' };
    } catch (error) {
      return { success: false, error: error.message || 'Error al cambiar la contraseña' };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar cambio de contraseña
  const cancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  return {
    passwordData,
    isChangingPassword,
    isLoading,
    setIsChangingPassword,
    handleChange,
    handleChangePassword,
    cancelPasswordChange,
  };
};
