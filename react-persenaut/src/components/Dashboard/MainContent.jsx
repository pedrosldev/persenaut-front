// src/components/Dashboard/MainContent/MainContent.jsx
import DashboardContent from "./DashboardContent";
import NotesContent from "./NotesContent";
import ChallengesContent from "./ChallengesContent";
import SettingsContent from "./SettingsContent";
import styles from "./MainContent.module.css";

const MainContent = ({ currentSection }) => {
  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardContent />;
      case "notes":
        return <NotesContent />;
      case "challenges":
        return <ChallengesContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return <main className={styles.mainContent}>{renderContent()}</main>;
};

export default MainContent;
