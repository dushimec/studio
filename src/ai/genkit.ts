
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import firebase from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
  model: 'googleai/gemini-1.5-flash',
  enableTracing: process.env.NODE_ENV !== 'production',
});
