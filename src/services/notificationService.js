// src/services/notificationService.js
import { httpClient } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

/**
 * Obtener desafíos pendientes del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<object>}
 */
export const getPendingChallenges = async (userId) => {
  try {
    return await httpClient.post(API_CONFIG.notifications.pending, { userId });
  } catch (error) {
    console.error("Error fetching pending challenges:", error);
    return { challenges: [] }; // Devuelve array vacío en caso de error
  }
};

/**
 * Iniciar un desafío
 * @param {string} challengeId - ID del desafío
 * @returns {Promise<object>}
 */
export const startChallenge = async (challengeId) => {
  try {
    return await httpClient.post(API_CONFIG.notifications.startChallenge, { challengeId });
  } catch (error) {
    console.error("Error starting challenge:", error);
    throw error;
  }
};
