const API_THEMES = import.meta.env.VITE_API_THEMES;
export const themeService = {
  // Obtener todos los temas del usuario
  async getUserThemes(userId) {
    try {
      console.log("🔄 Solicitando temas para usuario:", userId);
      const response = await fetch(`${API_THEMES}/user/${userId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error en getUserThemes:", error);
      throw new Error(`Error al cargar los temas: ${error.message}`);
    }
  },

  // ELIMINAR TEMA COMPLETO (SOLO 2 PARÁMETROS)
  async deleteTheme(theme, userId) {
    try {
      console.log("🗑️ Eliminando tema completo:", theme);
      const encodedTheme = encodeURIComponent(theme);

      const response = await fetch(`${API_THEMES}/${encodedTheme}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      console.log("📨 Status de respuesta:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Tema eliminado exitosamente:", result);
      return result;
    } catch (error) {
      console.error("❌ Error en deleteTheme:", error);
      throw new Error(`Error al eliminar el tema: ${error.message}`);
    }
  },

  // Eliminar múltiples temas
  async deleteMultipleThemes(themes, userId) {
    try {
      console.log("🗑️ Eliminando múltiples temas:", themes);
      const response = await fetch(`${API_THEMES}/delete-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themes, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar los temas");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error en deleteMultipleThemes:", error);
      throw new Error(`Error al eliminar los temas: ${error.message}`);
    }
  },
};
