import { geminiModel } from "~/config/google-ai-client";
import { type ClientMessage } from "~/constants/types";

export const getResponse = async (message: string): Promise<string> => {  
  const result = await geminiModel.generateContent(message);
  return result.response.text();
}

export const sendMessageWithContext = async (message: string, context: ClientMessage[]) => {
  const contextString = JSON.stringify(context);
  const promptWithContext = `Previous conversation context:\n${contextString}\n\nCurrent message: ${message}`;
  
  const result = await geminiModel.generateContent(promptWithContext);
  return result.response.text();
}
