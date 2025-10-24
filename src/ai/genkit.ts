import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let cachedAi: any = null;

export function getAI() {
  if (cachedAi) return cachedAi;

  cachedAi = genkit({
    plugins: [
      googleAI({apiKey: process.env.GEMINI_API_KEY}),
    ],
    model: 'googleai/gemini-1.5-flash',
    enableTracing: false,
  });

  return cachedAi;
}
