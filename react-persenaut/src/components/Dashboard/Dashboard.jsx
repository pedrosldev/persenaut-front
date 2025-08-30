// src/components/Dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  
  const checkAuth = async () => {
    const isAuthenticated = await authService.requireAuth(navigate, "/login");

    if (isAuthenticated) {
     
      await authService.updateAuthUI({
        onAuthenticated: (result) => setUser(result.user),
        onNotAuthenticated: () => navigate("/login"),
      });
    }
  };

  checkAuth();
}, [navigate]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      navigate("/login");
    } else {
      alert(result.error);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        user={user}
        onLogout={handleLogout}
      />
      <MainContent currentSection={currentSection} />
      <Footer />
    </div>
  );
};

export default Dashboard;
