// src/services/themeService.js
import { httpClient } from '../lib/httpClient';
import { API_CONFIG } from '../config/api';

export const themeService = {
  /**
   * Obtener todos los temas del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>}
   */
  async getUserThemes(userId) {
    try {
      console.log("🔄 Solicitando temas para usuario:", userId);
      const data = await httpClient.get(API_CONFIG.themes.getUserThemes(userId));
      return data;
    } catch (error) {
      console.error("❌ Error en getUserThemes:", error);
      throw new Error(`Error al cargar los temas: ${error.message}`);
    }
  },

  /**
   * Eliminar tema completo
   * @param {string} theme - Nombre del tema
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>}
   */
  async deleteTheme(theme, userId) {
    try {
      console.log("🗑️ Eliminando tema completo:", theme);
      const result = await httpClient.delete(API_CONFIG.themes.deleteTheme(theme), { userId });
      console.log("✅ Tema eliminado exitosamente:", result);
      return result;
    } catch (error) {
      console.error("❌ Error en deleteTheme:", error);
      throw new Error(`Error al eliminar el tema: ${error.message}`);
    }
  },

  /**
   * Eliminar múltiples temas
   * @param {Array<string>} themes - Array de nombres de temas
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>}
   */
  async deleteMultipleThemes(themes, userId) {
    try {
      console.log("🗑️ Eliminando múltiples temas:", themes);
      return await httpClient.post(API_CONFIG.themes.deleteMultiple, { themes, userId });
    } catch (error) {
      console.error("❌ Error en deleteMultipleThemes:", error);
      throw new Error(`Error al eliminar los temas: ${error.message}`);
    }
  },
  /**
   * Eliminar tema con nivel específico
   * @param {string} theme - Nombre del tema
   * @param {string} level - Nivel del tema
   * @param {string} userId - ID del usuario
   * @returns {Promise<object>}
   */
  async deleteThemeWithLevel(theme, level, userId) {
    try {
      console.log("🎯 Eliminando tema con nivel:", { theme, level });
      const result = await httpClient.delete(
        API_CONFIG.themes.deleteThemeWithLevel(theme, level),
        { userId }
      );
      console.log("✅ Tema con nivel eliminado:", result);
      return result;
    } catch (error) {
      console.error("❌ Error en deleteThemeWithLevel:", error);
      throw new Error(`Error al eliminar el tema: ${error.message}`);
    }
  }
};
