import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // Read and parse the components-list.json file
  const componentsPath = path.join(process.cwd(), 'components', 'components-list.json');
  const componentsJson = fs.readFileSync(componentsPath, 'utf-8');
  const componentsList = JSON.parse(componentsJson);

  // Call Gemini API as before
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': process.env.GEMINI_API_KEY || '',
    },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: `You are a helpful assistant that generates a JSON array of UI components for a React builder. 

User prompt: ${prompt}

Available components: ${JSON.stringify(componentsList)}

Generate a JSON array with this exact format:
[
  {
    "type": "component-name-from-list",
    "category": "navigation|header|arweave|builder",
    "props": {
      "title": "Example Title",
      "description": "Example description"
    }
  }
]

Only use component names from the provided list. Use kebab-case for component names (e.g., "ardacity-builder", "floating-navbar").` }] }
      ]
    }),
  });

  const data = await response.json();
  console.log('Gemini API response:', JSON.stringify(data, null, 2));

  // Optionally, extract the suggested components from Gemini's response (if possible)
  // For now, just log the available components for debugging
  // console.log('Available components for prompt:', prompt, '\n', JSON.stringify(componentsList, null, 2));

  // Return both Gemini's response and the available components
  return NextResponse.json({
    gemini: data,
    availableComponents: componentsList
  });
} 