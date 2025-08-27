import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importar el hook
import { authService } from "../services/authService";

const LoginComponent = ({ onLogin, redirectUrl = "/dashboard" }) => {
  const navigate = useNavigate(); // 👈 Inicializar navigate

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verificar si ya está autenticado al montar el componente
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const result = await authService.checkAuth();
        if (result.isAuthenticated) {
          navigate(redirectUrl); // 👈 redirección SPA
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

        navigate(redirectUrl); // 👈 navegar al dashboard tras login
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

  const styles = {
    container: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      padding: "40px",
      maxWidth: "600px",
      width: "100%",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "30px",
      fontSize: "2.5em",
      fontWeight: "300",
    },
    formGroup: { marginBottom: "25px" },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#555",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "15px",
      border: "2px solid #e0e0e0",
      borderRadius: "10px",
      fontSize: "16px",
      background: "#fafafa",
    },
    btn: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "15px 30px",
      borderRadius: "10px",
      fontSize: "18px",
      fontWeight: "600",
      cursor: "pointer",
      width: "100%",
      transition: "all 0.3s ease",
      marginTop: "20px",
    },
    btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
    loading: { textAlign: "center", margin: "20px 0" },
    spinner: {
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #667eea",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
      margin: "0 auto 10px",
    },
    error: {
      background: "#fee",
      color: "#c33",
      padding: "15px",
      borderRadius: "10px",
      marginTop: "20px",
      borderLeft: "4px solid #c33",
      textAlign: "center",
    },
  };

  if (isCheckingAuth) {
    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <main style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <p>Verificando sesión...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <main style={styles.container}>
        <h1 style={styles.title}>Iniciar sesión</h1>

        <div>
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
              style={styles.input}
              disabled={isLoading}
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
              style={styles.input}
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
            style={{
              ...styles.btn,
              ...(isLoading ? styles.btnDisabled : {}),
            }}
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </div>

        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <p>Verificando credenciales...</p>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </main>
    </div>
  );
};

export default LoginComponent;
