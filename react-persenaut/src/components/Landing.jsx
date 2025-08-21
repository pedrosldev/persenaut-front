import React from 'react';
import styles from './Landing.module.css'; // Antes: './Landing.css'
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className={styles.landing}>
      <header>
        <h1>🌟 PERSENAUT</h1>
        <p>
          Convierte el repaso en un hábito con <strong>retos personalizados</strong> que se adaptan a tu ritmo
        </p>
      </header>

      <div className={styles['cta-container']}>
       <Link to="/demo" className={styles.btn}>🚀 Probar Demo Gratis</Link>

        <Link to="/register" className={styles.btn}>📝 Regístrate para Guardar Tus Progresos</Link>
      </div>

      <footer>
        ¿Ya tienes cuenta? <a href="auth/login.html">Inicia sesión</a>
      </footer>
    </div>
  );
}
