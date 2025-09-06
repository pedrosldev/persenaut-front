// src/components/Dashboard/MainContent/MainContent.jsx
import DashboardContent from "./DashboardContent";
import NotesContent from "./NotesContent";
import ChallengesContent from "./ChallengesContent";
import SettingsContent from "./SettingsContent";
import styles from "./MainContent.module.css";

const MainContent = ({ currentSection, user }) => {
  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardContent user={user} />;
      case "notes":
        return <NotesContent user={user} />;
      case "challenges":
        return <ChallengesContent user={user} />;
      case "settings":
        return <SettingsContent user={user} />;
      default:
        return <DashboardContent user={user} />;
    }
  };

  return <main className={styles.mainContent}>{renderContent()}</main>;
};

export default MainContent;
