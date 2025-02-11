import { geminiModel } from "~/config/google-ai-client";

export const getResponse = async (message: string): Promise<string> => {  
  const result = await geminiModel.generateContent(message);
  return result.response.text();
}