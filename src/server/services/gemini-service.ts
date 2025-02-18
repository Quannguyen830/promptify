import { geminiModel } from "~/config/google-ai-client";
import { type ClientMessage } from "~/constants/types";

export const DEFAULT_GEMINI_CACHE_TTL=300;
export const DEFAULT_GEMINI_INSTRUCTION="Answer the question shortly, 5 sentences in average based on the context provided. Answer in text only."
export const GENERATE_TITLE_INSTRUCTION="Generate a concise, one-sentence title that summarizes the key topic of the following question: ";


// Basic send and get msg with default instruction
export const sendMessage = async (message: string): Promise<string> => {  
  const result = await geminiModel.generateContent(DEFAULT_GEMINI_INSTRUCTION + message);
  return result.response.text();
}

// Get chat title based on initial user message
export const generateChatTitle = async (content: string) : Promise<string> => {
  const result = await geminiModel.generateContent(GENERATE_TITLE_INSTRUCTION + content);

  return result.response.text()
}

// Send and get msg with context
export const sendMessageWithContext = async (message: string, context: ClientMessage[]) => {
  const contextString = JSON.stringify(context);
  const promptWithContext = `Previous conversation context:\n${contextString}\n\nCurrent message: ${message}`;
  
  const result = await geminiModel.generateContent(DEFAULT_GEMINI_INSTRUCTION + promptWithContext);
  return result.response.text();
}

// Send and get msg with context but can stream
export const sendMessageWithContextStreaming = async (message: string, context: ClientMessage[]) => {
  const contextString = JSON.stringify(context);
  const promptWithContext = `Previous conversation context:\n${contextString}\n\nCurrent message: ${message}`;
  
  const result = await geminiModel.generateContentStream(DEFAULT_GEMINI_INSTRUCTION + promptWithContext);
  return result;
}

export const streamMessage = async (content: string) => {
  const result = await geminiModel.generateContentStream(GENERATE_TITLE_INSTRUCTION + content);
  console.log(result);
  return result.stream;
}

