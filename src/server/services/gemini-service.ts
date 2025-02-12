import { geminiCacheManager, geminiModel, googleGenAIClient } from "~/config/google-ai-client";
import { type ClientMessage } from "~/constants/types";

export const DEFAULT_GEMINI_CACHE_TTL=300;
export const DEFAULT_GEMINI_INSTRUCTION="Answer the question shortly, 5 sentences in average based on the context provided. Answer in text only."
export const GENERATE_TITLE_INSTRUCTION="Generate a concise, one-sentence title that summarizes the key topic of the following question: ";


// Helper func 1
const clientMessageToGeminiCacheContent = (context: ClientMessage[]) => {
  return context.map(message => ({
    role: message.sender === 'AGENT' ? 'model' : 'user',
    parts: [
      {
        text: message.content
      }
    ]
  }));
}

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
  return result.stream;
}


// DONT USE THIS UNTIL GEMINI FIX CONTEXT CACHE 403 ON .get
// export const sendMessageWithCache = async (chatSessionId: string, message: string, context: ClientMessage[]) => {
//   let contextCache;
  
//   try {
//     // Attempt to retrieve existing chat session cache
//     contextCache = await geminiCacheManager.get(chatSessionId);
//   } catch (error) {
//     // If there's an error retrieving the cache, treat it as if no cache exists
//     contextCache = null;
//     console.log("Error running sendMessageWithCache", error);
//   }

//   // if no cache found, create a new cache and new model based on the new cache
//   if (!contextCache) {
//     contextCache = await geminiCacheManager.create({
//       model: "models/gemini-1.5-flash-001",
//       displayName: chatSessionId,
//       contents: clientMessageToGeminiCacheContent(context),
//       ttlSeconds: DEFAULT_GEMINI_CACHE_TTL
//     });
//   }
//   const cachedGeminiModel = googleGenAIClient.getGenerativeModelFromCachedContent(contextCache);
//   const result = await cachedGeminiModel.generateContent(message);

//   return result.response.text();
// }
