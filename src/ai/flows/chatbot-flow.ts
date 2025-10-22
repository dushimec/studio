'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful assistant. Answer the following question: ${prompt}`,
    });

    return llmResponse.text;
  }
);
