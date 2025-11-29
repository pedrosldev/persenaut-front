import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import styles from "./Register.module.css";

const RegisterComponent = ({
  onRegister,
  redirectUrl = "/login",
  loginUrl = "/login",
  dashboardUrl = "/dashboard",
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  // Verificar si ya está autenticado al montar el componente
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const result = await authService.checkAuth();
        if (result.isAuthenticated) {
          navigate(dashboardUrl);
        }
      } catch (error) {
        console.error("Error checking initial auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkInitialAuth();
  }, [navigate, dashboardUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    }

    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!formData.username.trim()) {
      errors.username = "El nombre de usuario es requerido";
    } else if (!usernamePattern.test(formData.username)) {
      errors.username =
        "Solo letras, números y guiones bajos (3-20 caracteres)";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Ingresa un correo electrónico válido";
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
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
    setError("");
    setValidationErrors({});
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...registerData } = formData;

    try {
      const result = await authService.register(registerData);

      if (result.success) {
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        if (onRegister) {
          onRegister(result.data);
        }

        const shouldGoToDashboard = result.data?.autoLogin === true;
        const targetUrl = shouldGoToDashboard ? dashboardUrl : redirectUrl;
        navigate(targetUrl);
      } else {
        setError(result.error || "Error desconocido en el registro");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras verifica autenticación inicial
  if (isCheckingAuth) {
    return (
      <div className={styles.pageContainer}>
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
    <div className={styles.pageContainer}>
      <main className={styles.container}>
        <h1 className={styles.title}>Crear cuenta</h1>
        
        <button
          type="button"
          onClick={() => navigate("/")}
          className={styles.backLink}
        >
          ← Volver a la página principal
        </button>

        <div>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tu nombre completo"
              className={`${styles.input} ${
                validationErrors.name ? styles.inputError : ""
              }`}
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
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ej: ana_2024"
              className={`${styles.input} ${
                validationErrors.username ? styles.inputError : ""
              }`}
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
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ejemplo@correo.com"
              className={`${styles.input} ${
                validationErrors.email ? styles.inputError : ""
              }`}
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
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Tu contraseña"
              className={`${styles.input} ${
                validationErrors.password ? styles.inputError : ""
              }`}
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
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repite tu contraseña"
              className={`${styles.input} ${
                validationErrors.confirmPassword ? styles.inputError : ""
              }`}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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
            onClick={handleSubmit}
            className={`${styles.btn} ${isLoading ? styles.btnDisabled : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrar"}
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
          Al registrarte, podrás iniciar sesión con tus credenciales.
          <br />
          ¿Ya tienes una cuenta?{" "}
          <a
            href="#"
            className={styles.link}
            onClick={(e) => {
              e.preventDefault();
              navigate(loginUrl);
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
