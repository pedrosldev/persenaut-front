/**
 * HTTP Client - Centraliza la lógica de peticiones HTTP
 * Elimina duplicación de código en servicios
 */

class HttpClient {
  constructor() {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.defaultOptions = {
      credentials: 'include', // Incluir cookies en todas las peticiones
    };
  }

  /**
   * Método base para realizar peticiones HTTP
   * @param {string} url - URL del endpoint
   * @param {object} options - Opciones de fetch
   * @returns {Promise<any>} - Respuesta parseada
   */
  async request(url, options = {}) {
    try {
      const config = {
        ...this.defaultOptions,
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);

      // Si es 204 No Content, no intentar parsear JSON
      if (response.status === 204) {
        return { success: true };
      }

      // Intentar parsear la respuesta
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      // Si el error ya tiene mensaje personalizado, mantenerlo
      if (error.message.includes('Error')) {
        throw error;
      }
      // Errores de red u otros
      throw new Error(`Error de conexión: ${error.message}`);
    }
  }

  /**
   * GET request
   * @param {string} url - URL del endpoint
   * @param {object} options - Opciones adicionales
   * @returns {Promise<any>}
   */
  async get(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   * @param {string} url - URL del endpoint
   * @param {object} data - Datos a enviar
   * @param {object} options - Opciones adicionales
   * @returns {Promise<any>}
   */
  async post(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   * @param {string} url - URL del endpoint
   * @param {object} data - Datos a enviar
   * @param {object} options - Opciones adicionales
   * @returns {Promise<any>}
   */
  async put(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   * @param {string} url - URL del endpoint
   * @param {object} data - Datos a enviar (opcional)
   * @param {object} options - Opciones adicionales
   * @returns {Promise<any>}
   */
  async delete(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   * @param {string} url - URL del endpoint
   * @param {object} data - Datos a enviar
   * @param {object} options - Opciones adicionales
   * @returns {Promise<any>}
   */
  async patch(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Exportar instancia singleton
export const httpClient = new HttpClient();
