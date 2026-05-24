import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = "You are the System Anatomy Analysis Engine, a highly specialized AI designed for systems engineering, code refactoring, and performance optimization. You assist users in diagnosing systemic failures, identifying bottlenecks, and providing technical strategies for rebuilding or refactoring complex software systems. Your tone is professional, analytical, and technical. You use monospaced formatting for code snippets and technical data. You are concise and focus on root cause analysis and engineering excellence.";

export async function generateChatResponse(messages: Message[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "An error occurred while communicating with the AI. Please try again.";
  }
}

export async function* generateChatResponseStream(messages: Message[]) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    for await (const chunk of response) {
      yield chunk.text || "";
    }
  } catch (error) {
    console.error("Error generating streaming response:", error);
    yield "An error occurred while communicating with the AI. Please try again.";
  }
}
