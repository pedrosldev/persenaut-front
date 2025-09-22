const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const GROQ_API = import.meta.env.VITE_GROQ_API;
const API_QUESTIONS = import.meta.env.VITE_API_QUESTIONS;

// export const fetchChallenge = async (prompt) => {
//     const payload = {
//         prompt,
//         model: "mistral",
//         stream: false,
//         options: { temperature: 0.7, top_p: 0.9 },
//     };

//     const response = await fetch(API_ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.message || `Error ${response.status}`);
//     }

//     const data = await response.json();
//     return (
//         data.reto ||
//         data.response ||
//         data.message?.content ||
//         data.choices?.[0]?.message?.content ||
//         ""
//     );
// };
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

export const saveQuestionToDB = async (questionData, theme, level, rawResponse, userId, deliveryTime = '09:00:00', frequency = 'daily', isActive = true) => {
    try {
        console.log("Intentando guardar en BD:", {
            theme,
            level,
            question: questionData.questionText,
        });

        const response = await fetch(API_QUESTIONS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                theme: theme,
                level: level,
                question: questionData.questionText,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
                rawResponse: rawResponse,
                userId: userId,
                deliveryTime: deliveryTime,
                frequency: frequency,
                isActive: isActive,
            }),
        });

        console.log("Respuesta del servidor:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            throw new Error(errorData.error || "Error al guardar la pregunta");
        }

        const result = await response.json();
        console.log("✅ Pregunta guardada con ID:", result.id);
        return result;
    } catch (error) {
        console.error("Error al guardar:", error);
        throw error;
    }
};