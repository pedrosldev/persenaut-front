// src/services/apiService.js
import { httpClient } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

/**
 * Generar y guardar pregunta
 * @param {object} questionData - Datos de la pregunta
 * @returns {Promise<object>}
 */
export const generateAndSaveQuestion = async (questionData) => {
  try {
    return await httpClient.post(API_CONFIG.questions.generate, questionData);
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
};
/**
 * Generar pregunta desde notas
 * @param {object} notesData - Datos de las notas
 * @returns {Promise<object>}
 */
export const generateFromNotes = async (notesData) => {
  try {
    return await httpClient.post(API_CONFIG.questions.generateFromNotes, notesData);
  } catch (error) {
    console.error("Error generating question from notes:", error);
    throw error;
  }
};
// export const testGroq = async (prompt) => {
//     try {
//         const res = await fetch(GROQ_API, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ prompt }),
//         });

//         if (!res.ok) {
//             const error = await res.json();
//             throw new Error(error.error || "Error en la API Groq");
//         }

//         const data = await res.json();
//         return data.response;
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// };

/**
 * Generar pregunta usando Groq API
 * @param {object} data - {theme, level, previousQuestions}
 * @returns {Promise<string>}
 */
export const testGroq = async (data) => {
  try {
    const response = await httpClient.post(API_CONFIG.questions.groq, {
      theme: data.theme,
      level: data.level,
      previousQuestions: data.previousQuestions || [],
    });
    return response.response;
  } catch (error) {
    console.error("Error en Groq API:", error);
    throw error;
  }
};

/**
 * Obtener consejos del tutor IA
 * @param {string} userId - ID del usuario
 * @param {string} timeRange - Rango de tiempo (default: 'week')
 * @returns {Promise<object>}
 */
export const getTutorAdvice = async (userId, timeRange = 'week') => {
  try {
    return await httpClient.post(API_CONFIG.tutor, { userId, timeRange });
  } catch (error) {
    console.error("Error getting tutor advice:", error);
    throw error;
  }
};

/**
 * Guardar respuesta del usuario (normal)
 * @param {object} responseData - Datos de la respuesta
 * @returns {Promise<object>}
 */
export const saveUserResponse = async (responseData) => {
  try {
    return await httpClient.post(API_CONFIG.questions.saveResponse, responseData);
  } catch (error) {
    console.error("Error saving user response:", error);
    throw error;
  }
};

/**
 * Guardar respuesta intensiva del usuario
 * @param {object} responseData - Datos de la respuesta intensiva
 * @returns {Promise<object>}
 */
export const saveIntensiveResponse = async (responseData) => {
  try {
    return await httpClient.post(API_CONFIG.questions.saveIntensiveResponses, responseData);
  } catch (error) {
    console.error("Error saving intensive response:", error);
    throw error;
  }
};