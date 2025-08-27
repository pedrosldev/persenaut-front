import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Dashboard = () => {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await authService.checkAuth();
        
        if (result.isAuthenticated) {
          setUser(result.user);
          setAuthError('');
        } else {
          // Redirigir al login usando navigate
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setAuthError('Error de autenticación');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await authService.logout();
      
      if (result.success) {
        // Redirigir al login después de cerrar sesión usando navigate
        navigate('/login');
      } else {
        console.error('Error al cerrar sesión:', result.error);
        setAuthError(result.error || 'Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en logout:', error);
      setAuthError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif' 
      }}>
        <h2>Cargando...</h2>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header con información de usuario y botón logout */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '2px solid #eee'
      }}>
        <div>
          <h1>Dashboard de Prueba</h1>
          {user && (
            <p style={{ color: '#666', marginTop: '5px' }}>
              Bienvenido, {user.name || user.email || 'Usuario'}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Botón para volver al home */}
          <button 
            onClick={() => navigate('/')}
            style={{ 
              padding: '10px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Inicio
          </button>
          
          <button 
            onClick={handleLogout}
            disabled={isLoading}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              opacity: isLoading ? 0.6 : 1,
              transition: 'opacity 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.opacity = '0.8';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.opacity = '1';
              }
            }}
          >
            {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {authError && (
        <div style={{
          padding: '10px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #fcc'
        }}>
          ⚠️ {authError}
        </div>
      )}

      {/* Contenido principal */}
      <div>
        <p>Este es un componente simple para testing con autenticación</p>
        
        <div style={{ margin: '20px 0' }}>
          <h2>Contador: {count}</h2>
          <button 
            onClick={handleIncrement}
            style={{ 
              marginRight: '10px', 
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Incrementar
          </button>
          <button 
            onClick={handleDecrement}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Decrementar
          </button>
        </div>

        <div>
          <h3>Estado actual:</h3>
          <p>El contador está en: <strong>{count}</strong></p>
          {count > 5 && <p style={{ color: '#28a745' }}>✅ ¡El contador es mayor que 5!</p>}
          {count < 0 && <p style={{ color: '#dc3545' }}>❌ ¡El contador es negativo!</p>}
        </div>

        {/* Información de usuario */}
        {user && (
          <div style={{ 
            marginTop: '30px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4>📋 Información del usuario:</h4>
            <pre style={{ 
              fontSize: '12px', 
              overflow: 'auto',
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #dee2e6'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {/* Información de sesión */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '8px',
          border: '1px solid #b8daff'
        }}>
          <h4>🔐 Estado de autenticación:</h4>
          <p>✅ Sesión activa - Usuario autenticado</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Esta página está protegida por el servicio de autenticación.
          </p>
        </div>

        {/* Navegación adicional */}
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h4>🧭 Navegación:</h4>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={() => navigate('/demo')}
              style={{ 
                padding: '8px 12px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Ir a Demo
            </button>
            <button 
              onClick={() => navigate('/register')}
              style={{ 
                padding: '8px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Ir a Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;