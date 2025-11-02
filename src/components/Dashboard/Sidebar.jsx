// src/components/Dashboard/Sidebar/Sidebar.jsx
import { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ currentSection, onSectionChange, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "notes", label: "Mis apuntes", icon: "📝" },
    { id: "challenges", label: "Programar retos", icon: "🎯" },
    { id: "intensiveReview", label: "Repaso intensivo", icon: "🔄" },
    { id: "metrics", label: "Mis Métricas", icon: "📈" },
    { id: "themes", label: "Mis Temas", icon: "🗂️" },
    { id: "settings", label: "Configuración", icon: "⚙️" },
  ];

  const handleSectionChange = (id) => {
    onSectionChange(id);
    setIsOpen(false); // Cierra el menú tras seleccionar
  };

  return (
    <>
      {/* Botón hamburguesa visible solo en móviles */}
      <button
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.logoContainer}>
          <h1>PERSENAUT</h1>
        </div>
        <nav className={styles.navMenu}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={currentSection === item.id ? styles.active : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionChange(item.id);
                  }}
                >
                  <span className={styles.icon}>{item.icon}</span> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.userSection}>
          <div id="user-info">{user?.name || user?.email || "Usuario"}</div>
          <button onClick={onLogout} className={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
