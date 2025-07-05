import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // Read and parse the components-list.json file
  const componentsPath = path.join(process.cwd(), 'components', 'components-list.json');
  const componentsJson = fs.readFileSync(componentsPath, 'utf-8');
  const componentsList = JSON.parse(componentsJson);

  // Call Gemini API with enhanced prompt
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': process.env.GEMINI_API_KEY || '',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{
            text: `You are a helpful assistant that generates UI components for a React builder. 

User prompt: ${prompt}

Available components: ${JSON.stringify(componentsList)}

INSTRUCTIONS:
1. First, try to use existing components from the provided list. Use kebab-case for component names (e.g., "ardacity-builder", "floating-navbar").
2. If you need a component that doesn't exist in the list, generate a complete React functional component for it.
3. For each missing component, provide both the component suggestion AND the complete React code.

RESPONSE FORMAT:
Return a JSON object with this exact structure:
{
  "components": [
    {
      "type": "component-name-from-list",
      "category": "navigation|header|arweave|builder|ui",
      "props": {
        "title": "Example Title",
        "description": "Example description"
      }
    }
  ],
  "generatedComponents": [
    {
      "type": "missing-component-name",
      "category": "ui",
      "props": {
        "title": "Example Title"
      },
      "code": "import React from 'react';\\n\\nexport function MissingComponent({ title }) {\\n  return (\\n    <div className='p-4 border rounded-lg'>\\n      <h2>{title}</h2>\\n    </div>\\n  );\\n}"
    }
  ]
}

Only use component names from the provided list when possible. For missing components, generate clean, functional React components with proper TypeScript props and modern styling.` }]
        }
      ]
    }),
  });

  const data = await response.json();
  console.log('Gemini API response:', JSON.stringify(data, null, 2));

  // Try to extract the generated components array from Gemini's response
  let result = { components: [], generatedComponents: [] };
  try {
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      // Remove Markdown code block if present
      text = text.trim();
      if (text.startsWith('```')) {
        // Remove the first line (```json or ```)
        text = text.replace(/^```[a-zA-Z]*\n?/, '');
        // Remove the last line if it's ```
        text = text.replace(/\n?```$/, '');
      }
      result = JSON.parse(text);
      console.log('Gemini chosen components:', result.components);
      console.log('Gemini generated components:', result.generatedComponents);
    } else {
      console.warn('Could not find generated components in Gemini response.');
    }
  } catch (err) {
    console.error('Failed to parse Gemini generated components as JSON:', err);
    // Fallback: try to parse as simple array
    try {
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        text = text.trim();
        if (text.startsWith('```')) {
          text = text.replace(/^```[a-zA-Z]*\n?/, '');
          text = text.replace(/\n?```$/, '');
        }
        const fallbackComponents = JSON.parse(text);
        result = { components: fallbackComponents, generatedComponents: [] };
      }
    } catch (fallbackErr) {
      console.error('Fallback parsing also failed:', fallbackErr);
    }
  }

  // Return both Gemini's response and the parsed components
  return NextResponse.json({
    gemini: data,
    availableComponents: componentsList,
    result: result
  });
} 