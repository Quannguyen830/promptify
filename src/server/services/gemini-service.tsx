import { geminiModel } from "~/config/google-ai-client";

export const getResponse = async (message: string): Promise<string> => {
  console.log("message sent", message);
  
  const result = await geminiModel.generateContent(message);

  console.log(result.response.text());

  return result.response.text();
}