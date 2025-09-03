// LoginComponent.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import styles from "./Login.module.css"; // Importamos los estilos modulares

const LoginComponent = ({ onLogin, redirectUrl = "/dashboard" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const result = await authService.checkAuth();
        if (result.isAuthenticated) {
          navigate(redirectUrl);
        }
      } catch (error) {
        console.error("Error checking initial auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkInitialAuth();
  }, [navigate, redirectUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authService.login(email.trim(), password.trim());

      if (result.success) {
        setFormData({ email: "", password: "" });

        if (onLogin) {
          onLogin(result.data);
        }

        navigate(redirectUrl);
      } else {
        setError(result.error || "Error desconocido");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className={styles.background}>
        <main className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Verificando sesión...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <main className={styles.container}>
        <h1 className={styles.title}>Iniciar sesión</h1>

        <div>
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
              className={styles.input}
              disabled={isLoading}
            />
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
              className={styles.input}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className={`${styles.btn} ${isLoading ? styles.btnDisabled : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </div>

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Verificando credenciales...</p>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </main>
    </div>
  );
};

export default LoginComponent;
