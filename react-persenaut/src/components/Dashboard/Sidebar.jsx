// src/components/Dashboard/Sidebar/Sidebar.jsx
import styles from "./Sidebar.module.css";

const Sidebar = ({ currentSection, onSectionChange, user, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "notes", label: "Mis apuntes", icon: "📝" },
    { id: "challenges", label: "Programar retos", icon: "🎯" },
    { id: "settings", label: "Configuración", icon: "⚙️" },
  ];

  return (
    <aside className={styles.sidebar}>
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
                  onSectionChange(item.id);
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
  );
};

export default Sidebar;
