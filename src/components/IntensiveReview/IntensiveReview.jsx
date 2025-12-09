// src/components/IntensiveReview/IntensiveReview.jsx
import React, { useState, useCallback } from "react";
import SessionConfig from "./SessionConfig";
import SessionGame from "./SessionGame";
import SessionResults from "./SessionResults";
import styles from "./IntensiveReview.module.css";

const START_INTENSIVE_REVIEW_API = import.meta.env
  .VITE_START_INTENSIVE_REVIEW_API;
const SAVE_RESULTS_INTENSIVE_REVIEW_API = import.meta.env
  .VITE_SAVE_RESULTS_INTENSIVE_REVIEW;

const IntensiveReview = ({ user }) => {
  const [currentView, setCurrentView] = useState("config");
  const [session, setSession] = useState(null);
  const [results, setResults] = useState(null);

  const startSession = useCallback(
    async (theme, gameMode) => {
      // ← Recibir gameMode
      try {
        const response = await fetch(START_INTENSIVE_REVIEW_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            theme,
            gameMode, // ← Enviar gameMode al backend
          }),
        });

        if (!response.ok) throw new Error("Error al iniciar sesión");

        const sessionData = await response.json();
        setSession({
          ...sessionData,
          gameMode, // ← Agregar gameMode a la sesión
          theme,    // ← Agregar theme a la sesión
        });
        setCurrentView("game");
      } catch (error) {
        alert("Error al iniciar sesión: " + error.message);
      }
    },
    [user.id]
  );

  // const endSession = useCallback(
  //   async (correctAnswers, incorrectAnswers, timeRemaining = 0) => {
  //     try {
  //       const response = await fetch(SAVE_RESULTS_INTENSIVE_REVIEW_API, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           sessionId: session.sessionId,
  //           correctAnswers,
  //           incorrectAnswers,
  //           gameMode: session.gameMode, // ← Guardar el modo
  //           timeUsed: session.gameMode === "timed" ? 180 - timeRemaining : null,
  //         }),
  //       });

  //       if (!response.ok) throw new Error("Error al guardar resultados");

  //       setResults({
  //         correct: correctAnswers.length,
  //         total: session.challenges.length,
  //         gameMode: session.gameMode,
  //         timeUsed: session.gameMode === "timed" ? 180 - timeRemaining : null,
  //       });
  //       setCurrentView("results");
  //     } catch (error) {
  //       alert("Error al guardar resultados: " + error.message);
  //     }
  //   },
  //   [session]
  // );

  // En src/components/IntensiveReview/IntensiveReview.jsx
  const endSession = useCallback(
    async (correctAnswers, incorrectAnswers, timeRemaining = 0, theme) => {
      try {
        // En modo timed: calcular tiempo usado
        // En modo survival: siempre 0 (no hay límite de tiempo)
        const timeUsed =
          session.gameMode === "timed" ? 180 - timeRemaining : 0;

        const payload = {
          sessionId: session.sessionId,
          correctAnswers,
          incorrectAnswers,
          gameMode: session.gameMode,
          timeUsed: timeUsed,
          theme: theme || session.theme,
        };

        console.log("📤 Enviando al backend:", payload);

        const response = await fetch(SAVE_RESULTS_INTENSIVE_REVIEW_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Error del backend:", response.status, errorData);
          throw new Error(errorData.error || "Error al guardar resultados");
        }

        const result = await response.json();

        setResults({
          correct: correctAnswers.length,
          total: session.challenges.length,
          gameMode: session.gameMode,
          timeUsed: timeUsed,
          points: result.points, // ← Nuevo
          accuracy: result.accuracy, // ← Nuevo
        });

        setCurrentView("results");
      } catch (error) {
        alert("Error al guardar resultados: " + error.message);
      }
    },
    [session]
  );
  const restart = useCallback(() => {
    setSession(null);
    setResults(null);
    setCurrentView("config");
  }, []);

  return (
    <div className={styles.container}>
      {currentView === "config" && (
        <SessionConfig user={user} onStart={startSession} />
      )}
      {currentView === "game" && session && (
        <SessionGame session={session} onEnd={endSession} />
      )}
      {currentView === "results" && results && (
        <SessionResults results={results} onRestart={restart} />
      )}
    </div>
  );
};

export default IntensiveReview;
