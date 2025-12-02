import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, Recommendation } from "../types";

// Initialize Gemini Client
// NOTE: In a production app, these calls might be proxied through your Java backend
// to keep the API key secure. For this demo, we call directly from the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizForTopic = async (topic: string, difficulty: string): Promise<QuizQuestion[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Generate a multiple-choice quiz with 3 questions about "${topic}". The difficulty should be ${difficulty}.
    Ensure the output is strictly valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "The zero-based index of the correct answer in the options array."
              },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return [];
  }
};

export const getAIRecommendations = async (userInterests: string[]): Promise<Recommendation[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Based on the user's interests: ${userInterests.join(', ')}, recommend 3 new learning topics or modules.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              reason: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] }
            },
            required: ["topic", "reason", "difficulty"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Recommendation[];
    }
    return [];
  } catch (error) {
    console.error("Failed to get recommendations:", error);
    return [];
  }
};
