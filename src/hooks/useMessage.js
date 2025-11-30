// src/hooks/useMessage.js
import { useState, useCallback } from 'react';

/**
 * Hook para manejar mensajes de feedback
 * @param {number} duration - Duración del mensaje en ms (default: 5000)
 * @returns {object} - Estado y funciones para mostrar mensajes
 */
export const useMessage = (duration = 5000) => {
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = useCallback(
    (type, text) => {
      setMessage({ type, text });
      setTimeout(() => setMessage({ type: '', text: '' }), duration);
    },
    [duration]
  );

  const clearMessage = useCallback(() => {
    setMessage({ type: '', text: '' });
  }, []);

  return {
    message,
    showMessage,
    clearMessage,
  };
};
