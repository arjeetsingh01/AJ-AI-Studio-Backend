const dotenv = require("dotenv");

dotenv.config();

// =====================================================
// GET GEMINI CLIENT
// =====================================================

const getGeminiClient = async () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  // @google/genai is ESM, so load it dynamically
  const { GoogleGenAI } = await import("@google/genai");

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

// =====================================================
// TEXT AI RESPONSE
// =====================================================

const generateAIResponse = async (message) => {
  const models = [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const ai = await getGeminiClient();

      console.log(`Gemini Text Request → ${model}`);

      const response = await ai.models.generateContent({
        model,
        config: {
          systemInstruction:
            "You are AJ AI, the AI assistant of AJ AI Studio. " +
            "Present yourself as AJ AI Studio's assistant. " +
            "Be helpful, friendly, clear and concise. " +
            "If the user specifically asks which underlying model or provider powers you, answer honestly.",
        },
        contents: message,
      });

      console.log(`Gemini Text Success → ${model}`);

      return response.text;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini Text Error → ${model}:`,
        error.message
      );

      // Fallback only for temporary availability problems
      if (
        error.message?.includes("503") ||
        error.message?.includes("UNAVAILABLE") ||
        error.message?.includes("high demand")
      ) {
        console.log(
          `Trying fallback model after ${model}...`
        );

        continue;
      }

      // Other errors should be returned immediately
      throw error;
    }
  }

  throw lastError || new Error("All Gemini text models failed");
};

// =====================================================
// IMAGE GENERATION
// =====================================================

const generateAIImage = async (prompt) => {
  try {
    const ai = await getGeminiClient();

    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-image",
      input: prompt,
      response_format: {
        type: "image",
        aspect_ratio: "1:1",
        image_size: "1K",
      },
    });

    if (!interaction.output_image) {
      throw new Error("Gemini did not return an image");
    }

    return {
      data: interaction.output_image.data,
      mimeType:
        interaction.output_image.mime_type || "image/png",
    };
  } catch (error) {
    console.error(
      "Gemini Image API Error:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  generateAIResponse,
  generateAIImage,
};