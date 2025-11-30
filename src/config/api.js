/**
 * Configuración centralizada de endpoints de API
 * Todas las variables de entorno en un solo lugar
 */

export const API_CONFIG = {
  // Autenticación
  auth: {
    login: import.meta.env.VITE_LOGIN_API,
    register: import.meta.env.VITE_REGISTER_API,
    logout: import.meta.env.VITE_LOGOUT_API,
    checkAuth: import.meta.env.VITE_CHECK_AUTH_API,
  },

  // Perfil de usuario
  profile: {
    base: import.meta.env.VITE_API_USER_PROFILE,
    getProfile: `${import.meta.env.VITE_API_USER_PROFILE}/profile`,
    updateProfile: `${import.meta.env.VITE_API_USER_PROFILE}/profile`,
    changePassword: `${import.meta.env.VITE_API_USER_PROFILE}/change-password`,
    deleteAccount: `${import.meta.env.VITE_API_USER_PROFILE}/account`,
  },

  // Preguntas y Desafíos
  questions: {
    generate: import.meta.env.VITE_API_ENDPOINT,
    generateFromNotes: import.meta.env.VITE_GENERATE_FROM_NOTES_API,
    groq: import.meta.env.VITE_GROQ_API,
    saveResponse: import.meta.env.VITE_API_SAVE_RESPONSE,
    saveIntensiveResponses: import.meta.env.VITE_SAVE_INTENSIVE_RESPONSES_API,
  },

  // Notificaciones y Desafíos
  notifications: {
    pending: import.meta.env.VITE_NOTIFY_API,
    startChallenge: import.meta.env.VITE_START_CHALLENGE_API,
  },

  // Temas
  themes: {
    base: import.meta.env.VITE_API_THEMES,
    getUserThemes: (userId) => `${import.meta.env.VITE_API_THEMES}/user/${userId}`,
    deleteTheme: (theme) => `${import.meta.env.VITE_API_THEMES}/${encodeURIComponent(theme)}`,
    deleteThemeWithLevel: (theme, level) => 
      `${import.meta.env.VITE_API_THEMES}/${encodeURIComponent(theme)}/${encodeURIComponent(level)}`,
    deleteMultiple: `${import.meta.env.VITE_API_THEMES}/delete-multiple`,
  },

  // Tutor IA
  tutor: import.meta.env.VITE_API_TUTOR,
};

/**
 * Helper para validar que todas las variables de entorno estén configuradas
 * Útil para desarrollo y debugging
 */
export const validateAPIConfig = () => {
  const missing = [];

  const checkValue = (obj, path = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        checkValue(value, currentPath);
      } else if (typeof value === 'string' && value.includes('undefined')) {
        missing.push(currentPath);
      }
    });
  };

  checkValue(API_CONFIG);

  if (missing.length > 0) {
    console.warn('⚠️ Variables de entorno faltantes:', missing);
    return false;
  }

  console.log('✅ Todas las variables de entorno están configuradas');
  return true;
};
