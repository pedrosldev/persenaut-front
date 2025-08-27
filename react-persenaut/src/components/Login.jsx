import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

// AuthService - Módulo para gestión de autenticación
// class AuthService {
//   constructor() {
//     this.API_URL_LOGIN = import.meta.env.VITE_LOGIN_API;
//     this.API_URL_LOGOUT = import.meta.env.VITE_LOGOUT_API || `${this.API_URL_LOGIN.replace('/login', '/logout')}`;
//     this.API_URL_CHECK_AUTH = import.meta.env.VITE_CHECK_AUTH_API || `${this.API_URL_LOGIN.replace('/login', '/check-auth')}`;
//   }

//   async checkAuth() {
//     try {
//       const res = await fetch(this.API_URL_CHECK_AUTH, {
//         method: 'GET',
//         credentials: 'include'
//       });

//       if (res.ok) {
//         const data = await res.json();
//         return {
//           success: true,
//           isAuthenticated: data.isAuthenticated,
//           user: data.user
//         };
//       } else {
//         return {
//           success: false,
//           isAuthenticated: false
//         };
//       }
//     } catch (error) {
//       console.error("Error verificando autenticación:", error);
//       return {
//         success: false,
//         isAuthenticated: false,
//         error
//       };
//     }
//   }

//   async requireAuth(redirectUrl = '/auth/login.html') {
//     const result = await this.checkAuth();
    
//     if (!result.isAuthenticated) {
//       window.location.href = redirectUrl;
//       return false;
//     }
    
//     return true;
//   }

//   async login(email, password) {
//     try {
//       const res = await fetch(this.API_URL_LOGIN, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include'
//       });

//       const data = await res.json();

//       if (res.ok) {
//         return {
//           success: true,
//           data
//         };
//       } else {
//         return {
//           success: false,
//           error: data.error || 'Credenciales inválidas'
//         };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: 'Error conectando con el servidor'
//       };
//     }
//   }

//   async logout() {
//     try {
//       const res = await fetch(this.API_URL_LOGOUT, {
//         method: 'POST',
//         credentials: 'include'
//       });

//       return {
//         success: res.ok,
//         error: res.ok ? null : 'Error al cerrar sesión'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: 'Error conectando con el servidor'
//       };
//     }
//   }
// }

// Instancia singleton
// const authService = new AuthService();

const LoginComponent = ({ onLogin, onNavigate, redirectUrl = '/dashboard' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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

  // Simulación del servicio de autenticación

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async () => {
    
    const { email, password } = formData;
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.login(email.trim(), password.trim());
      
      if (result.success) {
        setFormData({ email: '', password: '' });
        
        // Ejecutar callback onLogin si existe
        if (onLogin) {
          onLogin(result.data);
        }
        
        // Navegar al dashboard
        if (onNavigate) {
          onNavigate(redirectUrl);
        } else {
          // Fallback a navegación directa si no hay callback
          window.location.href = redirectUrl;
        }
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      console.error('Login error:', err);
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

    // Demo info
    demoInfo: {
      marginTop: '20px',
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '10px',
      fontSize: '14px',
      color: '#666',
      textAlign: 'center'
    }
  };

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
        <h1 style={styles.title}>Iniciar sesión</h1>
        
        <div onSubmit={handleSubmit}>
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
                ...(document.activeElement?.id === 'email' ? styles.inputFocus : {})
              }}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('password').focus();
                }
              }}
            />
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
                ...(document.activeElement?.id === 'password' ? styles.inputFocus : {})
              }}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
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
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
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
            <p>Verificando credenciales...</p>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.demoInfo}>
          <strong>Información:</strong><br />
          Usa tus credenciales para iniciar sesión.<br />
          Las cookies se gestionan automáticamente.
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

export default LoginComponent;