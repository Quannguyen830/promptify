import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GoogleAICacheManager,
} from '@google/generative-ai/server';


export const GEMINI_VERSION = "gemini-1.5-flash";

const NEXT_PUBLIC_GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
if (!NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY in environment variables');
}

export const googleGenAIClient = new GoogleGenerativeAI(NEXT_PUBLIC_GEMINI_API_KEY);
export const geminiModel = googleGenAIClient.getGenerativeModel({ model: GEMINI_VERSION });

export const geminiCacheManager = new GoogleAICacheManager(NEXT_PUBLIC_GEMINI_API_KEY);
