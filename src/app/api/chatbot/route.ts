import { chatbot } from '@/ai/flows/chatbot-flow';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await chatbot(message);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
