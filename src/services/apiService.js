const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const GROQ_API = import.meta.env.VITE_GROQ_API;



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
export const testGroq = async (prompt) => {
    try {
        const res = await fetch(GROQ_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Error en la API Groq");
        }

        const data = await res.json();
        return data.response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

