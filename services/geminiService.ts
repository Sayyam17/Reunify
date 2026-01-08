
import { GoogleGenAI, Modality } from "@google/genai";
import type { GeminiImagePart } from '../types';

const getGenAIClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey });
};

const dataUrlToGeminiPart = (dataUrl: string): GeminiImagePart => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL');
  }
  const [, mimeType, data] = match;
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
};

const stylePrompts: { [key: string]: string } = {
  natural: "The style should be warm and photorealistic, as if the two people were actually in the same location. Use consistent lighting and a natural, professional background.",
  anime: "Render the final image in a high-quality, modern anime style with expressive character designs and vibrant coloring.",
  sketch: "A sophisticated, hand-drawn pencil sketch capturing the connection between the subjects. Artistic and detailed.",
  ghibli: "In the style of a Studio Ghibli film. Painterly textures, soft lighting, and an emotional atmosphere."
};

export const reunifyImages = async (
  photoOneDataUrl: string,
  photoTwoDataUrl:string,
  style: string
): Promise<string> => {
  try {
    const ai = getGenAIClient();
    const partOne = dataUrlToGeminiPart(photoOneDataUrl);
    const partTwo = dataUrlToGeminiPart(photoTwoDataUrl);

    const stylePrompt = stylePrompts[style] || stylePrompts.natural;

    const finalPrompt = `Reunify the two people from these separate photos into one single, high-quality image. They should be posed together in a respectful and heartwarming way, showing a clear connection—like standing next to each other or sharing a friendly interaction. The person from the second photo should look like they are part of the first person's scene. ${stylePrompt} Ensure the final image is a 1:1 square.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          partOne,
          partTwo,
          { text: finalPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];
    
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error("Failed to generate the reunified image.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        throw new Error(`Reunification Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during image generation.");
  }
};


export const generateLetter = async (message: string): Promise<string> => {
    try {
        const ai = getGenAIClient();
        const prompt = `Write a thoughtful, short letter about connection and shared memories based on the following context: "${message}". The letter should be exactly two paragraphs long and have a warm, sincere tone. Plain text only.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error (Text Generation):", error);
        throw new Error("Failed to generate the accompanying letter.");
    }
}
