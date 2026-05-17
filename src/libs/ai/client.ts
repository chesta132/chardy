import { GEMINI_API_KEY } from "@/config";
import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
