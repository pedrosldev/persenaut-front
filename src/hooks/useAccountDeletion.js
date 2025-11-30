// src/hooks/useAccountDeletion.js
import { useState } from 'react';
import { deleteAccount } from '../services/profileService';

/**
 * Hook para manejar la eliminación de cuenta
 * @param {Function} onAccountDeleted - Callback cuando la cuenta se elimina
 * @returns {object} - Estado y funciones para eliminación de cuenta
 */
export const useAccountDeletion = (onAccountDeleted) => {
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manejar cambio en el campo de contraseña
  const handlePasswordChange = (e) => {
    setDeletePassword(e.target.value);
  };

  // Eliminar cuenta
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      return { success: false, error: 'Debes ingresar tu contraseña para eliminar tu cuenta' };
    }

    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (!confirmed) {
      return { success: false, cancelled: true };
    }

    setIsLoading(true);
    try {
      await deleteAccount(deletePassword);
      
      if (onAccountDeleted) {
        onAccountDeleted();
      }

      return { success: true, message: 'Cuenta eliminada correctamente' };
    } catch (error) {
      return { success: false, error: error.message || 'Error al eliminar la cuenta' };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar eliminación
  const cancelDeletion = () => {
    setDeletePassword('');
    setIsDeleting(false);
  };

  return {
    deletePassword,
    isDeleting,
    isLoading,
    setIsDeleting,
    handlePasswordChange,
    handleDeleteAccount,
    cancelDeletion,
  };
};
