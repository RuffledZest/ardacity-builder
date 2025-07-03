import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': process.env.GEMINI_API_KEY || '',
    },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: `You are a helpful assistant that generates a JSON array of UI components for a React builder. Each component should have a type and props. User prompt: ${prompt}` }] }
      ]
    }),
  });

  const data = await response.json();
  console.log('Gemini API response:', JSON.stringify(data, null, 2)); // Improved debug log
  // Gemini's response is in data.candidates[0].content.parts[0].text
  return NextResponse.json(data);
} 