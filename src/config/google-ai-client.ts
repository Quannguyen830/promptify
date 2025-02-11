import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GoogleAICacheManager,
} from '@google/generative-ai/server';

const GEMINI_VERSION = "gemini-1.5-flash";

const NEXT_PUBLIC_GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
if (!NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY in environment variables');
}

const googleGenAIClient = new GoogleGenerativeAI(NEXT_PUBLIC_GEMINI_API_KEY);
export const geminiModel = googleGenAIClient.getGenerativeModel({ model: GEMINI_VERSION });

// const googleAICacheManager = new GoogleAICacheManager(NEXT_PUBLIC_GEMINI_API_KEY);
// const CACHE_MANA_DISPLAY_NAME = "gemini cache mana name";
// const TTL = 300;
// const cache = await googleAICacheManager.create({
//   displayName = CACHE_MANA_DISPLAY_NAME,
//   model = GEMINI_VERSION,
//   ttlSeconds = TTL
// })
// export const geminiModel_cached = getGenerativeModelFromCachedContent()
