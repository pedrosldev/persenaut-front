// src/services/profileService.js
import { httpClient } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

/**
 * Obtener perfil del usuario
 * @returns {Promise<object>}
 */
export const getProfile = async () => {
  try {
    return await httpClient.get(API_CONFIG.profile.getProfile);
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

/**
 * Actualizar perfil del usuario
 * @param {object} profileData - Datos del perfil
 * @returns {Promise<object>}
 */
export const updateProfile = async (profileData) => {
  try {
    return await httpClient.put(API_CONFIG.profile.updateProfile, profileData);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Cambiar contraseña del usuario
 * @param {object} passwordData - {currentPassword, newPassword}
 * @returns {Promise<object>}
 */
export const changePassword = async (passwordData) => {
  try {
    return await httpClient.put(API_CONFIG.profile.changePassword, passwordData);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

/**
 * Eliminar cuenta del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>}
 */
export const deleteAccount = async (password) => {
  try {
    return await httpClient.delete(API_CONFIG.profile.deleteAccount, { password });
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
