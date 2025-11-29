// src/components/Dashboard/DashboardContent/DashboardContent.jsx
import { useState } from "react";
import styles from "./DashboardContent.module.css";
import NotificationsPanel from "./NotificationsPanel";
import ChallengeResolver from "./ChallengeResolver";
import TutorPanel from "../TutorPanel";

const DashboardContent = ({ user }) => {

  const [currentChallenge, setCurrentChallenge] = useState(null);

  const handleChallengeSelect = (challenge) => {
    setCurrentChallenge(challenge);
  };
  const handleChallengeComplete = () => {
    setCurrentChallenge(null);
    
  };
  return (
    <>
      <header className={styles.contentHeader}>
        <h2>¡Tú puedes lograrlo {user.name}!</h2>
        <NotificationsPanel
          user={user}
          onChallengeSelect={handleChallengeSelect}
        />
        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar..." />
        </div>
      </header>
      <div className={styles.content}>
        {currentChallenge ? (
          <ChallengeResolver
            challenge={currentChallenge}
            onComplete={handleChallengeComplete}
            userId={user.id}
          />
        ) : (
          <div>


            <TutorPanel userId={user.id} />
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardContent;
