const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const GROQ_API = import.meta.env.VITE_GROQ_API;
const  NOTES_API = import.meta.env.VITE_GENERATE_FROM_NOTES_API;
const API_TUTOR = import.meta.env.VITE_API_TUTOR;
const SAVE_RESPONSE_API = import.meta.env.VITE_API_SAVE_RESPONSE;
const SAVE_INTENSIVE_RESPONSES_API = import.meta.env
  .VITE_SAVE_INTENSIVE_RESPONSES_API;


export const generateAndSaveQuestion = async (questionData) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
};
export const generateFromNotes = async (notesData) => {
  try {
    const response = await fetch(NOTES_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notesData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating question from notes:", error);
    throw error;
  }
};
// export const testGroq = async (prompt) => {
//     try {
//         const res = await fetch(GROQ_API, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ prompt }),
//         });

//         if (!res.ok) {
//             const error = await res.json();
//             throw new Error(error.error || "Error en la API Groq");
//         }

//         const data = await res.json();
//         return data.response;
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// };

export const testGroq = async (data) => {
  try {
    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ Enviar theme, level, previousQuestions en lugar de prompt
      body: JSON.stringify({
        theme: data.theme,
        level: data.level,
        previousQuestions: data.previousQuestions || [],
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error en la API Groq");
    }

    const data_response = await res.json();
    return data_response.response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// En tu apiService.js - AÑADE ESTO
export const getTutorAdvice = async (userId, timeRange = 'week') => {
  try {
    const response = await fetch(`${API_TUTOR}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, timeRange }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting tutor advice:", error);
    throw error;
  }
};

// ✅ PARA RESPUESTAS NORMALES
export const saveUserResponse = async (responseData) => {
  try {
    const response = await fetch(SAVE_RESPONSE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responseData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving user response:", error);
    throw error;
  }
};

// ✅ PARA RESPUESTAS INTENSIVAS
export const saveIntensiveResponse = async (responseData) => {
  try {
    const response = await fetch(SAVE_INTENSIVE_RESPONSES_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responseData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving intensive response:", error);
    throw error;
  }
};