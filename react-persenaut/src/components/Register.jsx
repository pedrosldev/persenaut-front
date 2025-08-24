import React, { useState, useEffect } from 'react';

// AuthService - Módulo para gestión de autenticación
class AuthService {
  constructor() {
    this.API_URL_LOGIN = import.meta.env.VITE_LOGIN_API;
    this.API_URL_REGISTER = import.meta.env.VITE_REGISTER_API || `${this.API_URL_LOGIN.replace('/login', '/register')}`;
    this.API_URL_LOGOUT = import.meta.env.VITE_LOGOUT_API || `${this.API_URL_LOGIN.replace('/login', '/logout')}`;
    this.API_URL_CHECK_AUTH = import.meta.env.VITE_CHECK_AUTH_API || `${this.API_URL_LOGIN.replace('/login', '/check-auth')}`;
  }

  async checkAuth() {
    try {
      const res = await fetch(this.API_URL_CHECK_AUTH, {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          isAuthenticated: data.isAuthenticated,
          user: data.user
        };
      } else {
        return {
          success: false,
          isAuthenticated: false
        };
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      return {
        success: false,
        isAuthenticated: false,
        error
      };
    }
  }

  async register(userData) {
    try {
      const res = await fetch(this.API_URL_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        return {
          success: true,
          data
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error en el registro'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error conectando con el servidor'
      };
    }
  }
}

// Instancia singleton
const authService = new AuthService();

const RegisterComponent = ({ onRegister, onNavigate, redirectUrl = '/app/dashboard.html', loginUrl = '/auth/login.html' }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  // Verificar si ya está autenticado al montar el componente
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const result = await authService.checkAuth();
        if (result.isAuthenticated) {
          // Si ya está autenticado, redirigir
          if (onNavigate) {
            onNavigate(redirectUrl);
          } else {
            window.location.href = redirectUrl;
          }
        }
      } catch (error) {
        console.error('Error checking initial auth:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkInitialAuth();
  }, [onNavigate, redirectUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    // Validar username
    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (!usernamePattern.test(formData.username)) {
      errors.username = 'Solo letras, números y guiones bajos (3-20 caracteres)';
    }

    // Validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
  };

  const handleSubmit = async () => {
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    setError('');
    setValidationErrors({});

    const { confirmPassword, ...registerData } = formData;

    try {
      const result = await authService.register(registerData);
      
      if (result.success) {
        setFormData({
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Ejecutar callback onRegister si existe
        if (onRegister) {
          onRegister(result.data);
        }
        
        // Navegar al dashboard o login según la respuesta
        const targetUrl = result.data?.requiresVerification ? loginUrl : redirectUrl;
        if (onNavigate) {
          onNavigate(targetUrl);
        } else {
          window.location.href = targetUrl;
        }
      } else {
        setError(result.error || 'Error desconocido en el registro');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    // CSS Reset y Base
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    },
    
    body: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },

    // Contenedor principal
    container: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      maxWidth: '600px',
      width: '100%'
    },

    // Título
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '30px',
      fontSize: '2.5em',
      fontWeight: '300'
    },

    // Grupo de formulario
    formGroup: {
      marginBottom: '25px'
    },

    // Labels
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontWeight: '500',
      fontSize: '1.1em'
    },

    // Inputs
    input: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      background: '#fafafa'
    },

    inputFocus: {
      outline: 'none',
      borderColor: '#667eea',
      background: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },

    inputError: {
      borderColor: '#e74c3c',
      background: '#fdf2f2'
    },

    // Hint text
    hint: {
      fontSize: '0.85em',
      color: '#777',
      marginTop: '5px',
      display: 'block'
    },

    // Botón principal
    btn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.3s ease',
      marginTop: '20px'
    },

    btnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
    },

    btnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    },

    // Loading
    loading: {
      textAlign: 'center',
      margin: '20px 0'
    },

    spinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 10px'
    },

    // Error
    error: {
      background: '#fee',
      color: '#c33',
      padding: '15px',
      borderRadius: '10px',
      marginTop: '20px',
      borderLeft: '4px solid #c33',
      textAlign: 'center'
    },

    // Error de validación
    validationError: {
      color: '#e74c3c',
      fontSize: '0.85em',
      marginTop: '5px',
      display: 'block'
    },

    // Información
    infoBox: {
      marginTop: '20px',
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '10px',
      fontSize: '14px',
      color: '#666',
      textAlign: 'center'
    },

    // Link
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  // Mostrar loading mientras verifica autenticación inicial
  if (isCheckingAuth) {
    return (
      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={styles.container}>
          <div style={styles.loading}>
            <div
              style={{
                ...styles.spinner,
                animation: 'spin 1s linear infinite'
              }}
            />
            <p>Verificando sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <main style={styles.container}>
        <h1 style={styles.title}>Crear cuenta</h1>
        
        <div>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tu nombre completo"
              style={{
                ...styles.input,
                ...(validationErrors.name ? styles.inputError : {})
              }}
              disabled={isLoading}
            />
            {validationErrors.name && (
              <span style={styles.validationError}>{validationErrors.name}</span>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ej: ana_2024"
              style={{
                ...styles.input,
                ...(validationErrors.username ? styles.inputError : {})
              }}
              disabled={isLoading}
            />
            <small style={styles.hint}>Este será tu identificador único en la plataforma.</small>
            {validationErrors.username && (
              <span style={styles.validationError}>{validationErrors.username}</span>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ejemplo@correo.com"
              style={{
                ...styles.input,
                ...(validationErrors.email ? styles.inputError : {})
              }}
              disabled={isLoading}
            />
            {validationErrors.email && (
              <span style={styles.validationError}>{validationErrors.email}</span>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Tu contraseña"
              style={{
                ...styles.input,
                ...(validationErrors.password ? styles.inputError : {})
              }}
              disabled={isLoading}
            />
            {validationErrors.password && (
              <span style={styles.validationError}>{validationErrors.password}</span>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repite tu contraseña"
              style={{
                ...styles.input,
                ...(validationErrors.confirmPassword ? styles.inputError : {})
              }}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            {validationErrors.confirmPassword && (
              <span style={styles.validationError}>{validationErrors.confirmPassword}</span>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              ...styles.btn,
              ...(isLoading ? styles.btnDisabled : {})
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                Object.assign(e.target.style, styles.btnHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>

        {isLoading && (
          <div style={styles.loading}>
            <div
              style={{
                ...styles.spinner,
                animation: 'spin 1s linear infinite'
              }}
            />
            <p>Creando tu cuenta...</p>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.infoBox}>
          ¿Ya tienes una cuenta?{' '}
          <a 
            href="#" 
            style={styles.link}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate(loginUrl);
              } else {
                window.location.href = loginUrl;
              }
            }}
          >
            Inicia sesión aquí
          </a>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 20px !important;
            max-width: 100% !important;
            box-shadow: none !important;
          }
          
          h1 {
            font-size: 1.8em !important;
            margin-bottom: 20px !important;
          }
          
          .btn {
            font-size: 16px !important;
            padding: 12px 20px !important;
          }
          
          input {
            padding: 12px !important;
            font-size: 14px !important;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 1.5em !important;
          }
          
          .btn {
            font-size: 14px !important;
            padding: 10px 16px !important;
          }
          
          input {
            padding: 10px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterComponent;