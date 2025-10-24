'use server';
import {getAI} from '@/ai/genkit';
import {z} from 'zod';

export async function chatbot(prompt: string): Promise<string> {
  const ai = getAI();

  const chatbotFlow = ai.defineFlow(
    {
      name: 'chatbotFlow',
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (prompt: string) => {
      const llmResponse = await ai.generate({
        prompt: `You are a helpful assistant. Answer the following question: ${prompt}`,
      });

      return llmResponse.text();
    }
  );

  return chatbotFlow(prompt);
}
