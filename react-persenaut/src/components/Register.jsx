import React, { useState, useEffect } from 'react';
import styles from './Register.module.css';

// AuthService - Módulo para gestión de autenticación
class AuthService {
  constructor() {
    this.API_URL_LOGIN = import.meta.env.VITE_LOGIN_API;
    this.API_URL_REGISTER =
      import.meta.env.VITE_REGISTER_API ||
      `${this.API_URL_LOGIN.replace('/login', '/register')}`;
    this.API_URL_LOGOUT =
      import.meta.env.VITE_LOGOUT_API ||
      `${this.API_URL_LOGIN.replace('/login', '/logout')}`;
    this.API_URL_CHECK_AUTH =
      import.meta.env.VITE_CHECK_AUTH_API ||
      `${this.API_URL_LOGIN.replace('/login', '/check-auth')}`;
  }

  async checkAuth() {
    try {
      const res = await fetch(this.API_URL_CHECK_AUTH, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          isAuthenticated: data.isAuthenticated,
          user: data.user,
        };
      } else {
        return {
          success: false,
          isAuthenticated: false,
        };
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return {
        success: false,
        isAuthenticated: false,
        error,
      };
    }
  }

  async register(userData) {
    try {
      const res = await fetch(this.API_URL_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        return {
          success: true,
          data,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error en el registro',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error conectando con el servidor',
      };
    }
  }
}

// Instancia singleton
const authService = new AuthService();

const RegisterComponent = ({
  onRegister,
  onNavigate,
  redirectUrl = '/app/dashboard.html',
  loginUrl = '/auth/login.html',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const result = await authService.checkAuth();
        if (result.isAuthenticated) {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (!usernamePattern.test(formData.username)) {
      errors.username =
        'Solo letras, números y guiones bajos (3-20 caracteres)';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
  };

  const handleSubmit = async () => {
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
          confirmPassword: '',
        });

        if (onRegister) {
          onRegister(result.data);
        }

        const targetUrl = result.data?.requiresVerification
          ? loginUrl
          : redirectUrl;
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

  if (isCheckingAuth) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Verificando sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <h1 className={styles.title}>Crear cuenta</h1>

        <div>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`${styles.input} ${
                validationErrors.name ? styles.inputError : ''
              }`}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tu nombre completo"
              disabled={isLoading}
            />
            {validationErrors.name && (
              <span className={styles.validationError}>
                {validationErrors.name}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`${styles.input} ${
                validationErrors.username ? styles.inputError : ''
              }`}
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ej: ana_2024"
              disabled={isLoading}
            />
            <small className={styles.hint}>
              Este será tu identificador único en la plataforma.
            </small>
            {validationErrors.username && (
              <span className={styles.validationError}>
                {validationErrors.username}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`${styles.input} ${
                validationErrors.email ? styles.inputError : ''
              }`}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
            {validationErrors.email && (
              <span className={styles.validationError}>
                {validationErrors.email}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`${styles.input} ${
                validationErrors.password ? styles.inputError : ''
              }`}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
            {validationErrors.password && (
              <span className={styles.validationError}>
                {validationErrors.password}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`${styles.input} ${
                validationErrors.confirmPassword ? styles.inputError : ''
              }`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repite tu contraseña"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            {validationErrors.confirmPassword && (
              <span className={styles.validationError}>
                {validationErrors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="button"
            className={styles.btn}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Creando tu cuenta...</p>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.infoBox}>
          ¿Ya tienes una cuenta?{' '}
          <a
            href="#"
            className={styles.link}
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
    </div>
  );
};

export default RegisterComponent;
