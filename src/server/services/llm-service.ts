import { generateText, smoothStream, streamText } from "ai";

import { anthropic } from '@ai-sdk/anthropic';
import { google } from "@ai-sdk/google"
import { openai } from '@ai-sdk/openai';

import { type ChatProvider, type ClientMessage } from "~/constants/types";

export const DEFAULT_GEMINI_INSTRUCTION="Answer the question shortly, 5 sentences in average based on the context provided. Answer in text only."
export const GENERATE_TITLE_INSTRUCTION="Generate a concise, one-sentence title that summarizes the key topic of the following question: ";


const chatProviders = {
  "gemini-2.0-flash": google("models/gemini-2.0-flash"),
  "claude-3-haiku-20240307": anthropic('claude-3-haiku-20240307'),
  "gpt-4o": openai("gpt-4o"),
}

export const generateChatTitle = async (content: string) : Promise<string> => {
  const result = await generateText({
    model: chatProviders["gemini-2.0-flash"],
    system: GENERATE_TITLE_INSTRUCTION,
    prompt: content
  })

  return result.text;
}

// Send and get msg with context
export const sendMessageWithContext = async (message: string, context: ClientMessage[], model: ChatProvider) => {
  const contextString = JSON.stringify(context);
  const promptWithContext = `Previous conversation context:\n${contextString}\n\nCurrent message: ${message}`;
  const result = await generateText({
    model: chatProviders[model],
    system: DEFAULT_GEMINI_INSTRUCTION,
    prompt: promptWithContext
  })

  return result.text;
}

// Send and get msg with context but can stream
export const sendMessageWithContextStreaming = async (message: string, context: ClientMessage[], model: ChatProvider, contextFilesContent: string) => {
  const contextString = JSON.stringify(context);
  const promptWithContext = `Context that the user want to based the output on:\n${contextFilesContent} \nPrevious conversation context:\n${contextString}\n\nCurrent message: ${message}`;
  const result = streamText({
    model: chatProviders[model],
    prompt: promptWithContext,
    experimental_transform: smoothStream(),
  })

  return result;
}


