// services/notificationService.js
const API_NOTIFY = import.meta.env.VITE_NOTIFY_API;
const START_CHALLENGE_API = import.meta.env.VITE_START_CHALLENGE_API;

export const getPendingChallenges = async (userId) => {
  try {
    const response = await fetch(API_NOTIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pending challenges:", error);
    return { challenges: [] };
  }
};

export const startChallenge = async (challengeId) => {
  try {
    const response = await fetch(START_CHALLENGE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error starting challenge:", error);
    throw error;
  }
};
