import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // Read and parse the components-list.json file
  const componentsPath = path.join(process.cwd(), 'components', 'components-list.json');
  const componentsJson = fs.readFileSync(componentsPath, 'utf-8');
  const componentsList = JSON.parse(componentsJson);

  // Example prompt template for Gemini
  const THEME = 'dark'; // or 'light' or 'custom', can be parameterized
  const MODERN_STYLE = 'glassmorphism, gradients, soft shadows, rounded corners, and other modern UI/UX trends';
  const THEME_DETAILS = `\nTheme: ${THEME}\n- Primary color: #1a1a2e\n- Accent color: #e94560\n- Background: #121212\n- Font: 'Inter', sans-serif\n(Adjust these to match your actual theme)\n`;

  const aiPromptTemplate = `
Generate a React function component (plain JavaScript, no TypeScript, no import/export) styled with the latest modern UI trends (${MODERN_STYLE}).\nUse a ${THEME} theme for all colors and backgrounds.\n${THEME_DETAILS}
The component must accept all content, images, and data as props (do not hardcode any placeholder data inside the component).\nAfter the component code, provide a sample data object for the props in JSON format, using realistic and visually appealing values.\nIMPORTANT: All colors, backgrounds, and fonts must match the website's theme as described above. Do not use arbitrary or default colors.\n`;

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
            text: aiPromptTemplate + `\nYou are a helpful assistant that generates UI components for a React builder. \n\nUser prompt: ${prompt}\n\nAvailable components: ${JSON.stringify(componentsList)}\n\nINSTRUCTIONS:\n1. First, try to use existing components from the provided list. Use kebab-case for component names (e.g., "ardacity-builder", "floating-navbar").\n2. If you need a component that doesn't exist in the list, generate a complete React functional component for it.\n3. For each missing component, provide both the component suggestion AND the complete React code.\n4. IMPORTANT: For any custom component, generate a plain React functional component in JavaScript (not TypeScript), and do NOT include any import or export statements. Assume React is already in scope. The component should be a function definition only, e.g.:\n\nfunction MyComponent({ prop1, prop2 }) {\n  return <div>...</div>;\n}\n\nRESPONSE FORMAT:\nReturn a JSON object with this exact structure:\n{\n  "components": [\n    {\n      "type": "component-name-from-list",\n      "category": "navigation|header|arweave|builder|ui",\n      "props": {\n        "title": "Example Title",\n        "description": "Example description"\n      }\n    }\n  ],\n  "generatedComponents": [\n    {\n      "type": "descriptive-component-name",\n      "category": "ui",\n      "props": {\n        "title": "Example Title"\n      },\n      "code": "function DescriptiveComponent({ title }) { return <div>{title}</div>; }"\n    }\n  ]\n}\n\nOnly use component names from the provided list when possible. For missing components, generate clean, functional React components as described above.` }]
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
      console.log('=== AI RAW RESPONSE START ===');
      console.log(text);
      console.log('=== AI RAW RESPONSE END ===');
      result = JSON.parse(text);
      console.log('Gemini chosen components:', result.components);
      console.log('Gemini generated components:', result.generatedComponents);
      if (result.generatedComponents && Array.isArray(result.generatedComponents)) {
        result.generatedComponents.forEach((comp, idx) => {
          if (comp && typeof comp === 'object') {
            const c = comp as any;
            console.log(`=== GENERATED COMPONENT #${idx + 1} ===`);
            console.log('Type:', c.type);
            console.log('Code:', c.code);
            console.log('Sample Data:', c.props);
          }
        });
      }
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