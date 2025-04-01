import { generateText, streamText } from "ai";

import { anthropic } from '@ai-sdk/anthropic';
import { google } from "@ai-sdk/google"
import { type ClientMessage } from "~/constants/types";

export const DEFAULT_GEMINI_CACHE_TTL=300;
export const DEFAULT_GEMINI_INSTRUCTION="Answer the question shortly, 5 sentences in average based on the context provided. Answer in text only."
export const GENERATE_TITLE_INSTRUCTION="Generate a concise, one-sentence title that summarizes the key topic of the following question: ";


const CHAT_MODELS = {
  "gemini-2.0-flash": google("models/gemini-2.0-flash"),
  "claude-3-haiku-20240307": anthropic('claude-3-haiku-20240307')
}  

export enum ChatModelEnum {
  GEMINI_2_FLASH = "gemini-2.0-flash",
  CLAUDE_3_HAIKU_20240307 = "claude-3-haiku-20240307",
} 

export const generateChatTitle = async (content: string) : Promise<string> => {
  const result = await generateText({
    model: CHAT_MODELS["gemini-2.0-flash"],
    system: GENERATE_TITLE_INSTRUCTION,
    prompt: content
  })

  return result.text;
}

// Send and get msg with context
export const sendMessageWithContext = async (message: string, context: ClientMessage[], model: ChatModelEnum) => {
  const contextString = JSON.stringify(context);
  const promptWithContext = `Previous conversation context:\n${contextString}\n\nCurrent message: ${message}`;
  const result = await generateText({
    model: CHAT_MODELS[model],
    system: DEFAULT_GEMINI_INSTRUCTION,
    prompt: promptWithContext
  })

  return result.text;
}

// Send and get msg with context but can stream
export const sendMessageWithContextStreaming = (message: string, context: ClientMessage[], model: ChatModelEnum) => {
  const contextString = JSON.stringify(context);
  const promptWithContext = `Previous conversation context:\n${contextString}\n\nCurrent message: ${message}`;
  const result = streamText({
    model: CHAT_MODELS[model],
    system: DEFAULT_GEMINI_INSTRUCTION,
    prompt: promptWithContext
  })

  return result;
}


