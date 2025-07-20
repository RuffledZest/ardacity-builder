import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // Read and parse the components-list.json file
  const componentsPath = path.join(process.cwd(), 'components', 'components-list.json');
  const componentsJson = fs.readFileSync(componentsPath, 'utf-8');
  const componentsList = JSON.parse(componentsJson);

  // Read and parse the imageUrl-data.json file
  const imageUrlPath = path.join(process.cwd(), 'components', 'imageUrl-data.json');
  const imageUrlJson = fs.readFileSync(imageUrlPath, 'utf-8');
  const imageUrlList = JSON.parse(imageUrlJson);

  // Example prompt template for Gemini
  // const THEME = 'dark'; // or 'light' or 'custom', can be parameterized
  // const MODERN_STYLE = 'glassmorphism, gradients, soft shadows, rounded corners, and other modern UI/UX trends';


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

IMAGE URL DATASET: Use ONLY the following image URLs for any image, avatar, or imageUrl prop in generated components. When an image is required, pick a random URL from this list:
${JSON.stringify(imageUrlList, null, 2)}

INSTRUCTIONS:
PRIORITY: You MUST always check the provided component list first. If the requested component exists in the list, use it directly. Only generate a new component if it is not available in the list. All generated components must use the specified dark theme (black, white, zinc).
If the user requests a component that is not in the provided list, you MUST generate it and include it in the 'generatedComponents' array in the response, following the required format. The generated component should be visually appealing, modern, and follow the dark theme (black, white, zinc).
If the component is visually relevant (e.g., cards, profiles, banners, etc.), you MUST include an image prop (such as imageUrl, avatar, or similar) in the component's props and use it in the UI. The sample data for the component should include a realistic image URL (e.g., pick a random URL from the provided IMAGE URL DATASET).
IMPORTANT: For any dynamically generated component, do NOT use generic placeholder images (like '/placeholder.jpg'). Instead, always use a random image URL from the provided IMAGE URL DATASET for any image, avatar, or imageUrl prop.

IMPORTANT: For all images in cards or sections, use Tailwind classes like h-24, h-32, or a fixed height/width that fits well in a card. You may add an imageClass or imageHeight prop to control image size, and use it in the component. Do NOT make images excessively large. Default to a visually balanced size for card layouts.

ALL UI COMPONENTS (e.g., Accordion, AccordionItem, AccordionTrigger, AccordionContent, Button, Card, etc.) ARE ALREADY AVAILABLE IN SCOPE. DO NOT USE ANY IMPORT OR EXPORT STATEMENTS IN THE GENERATED CODE. Just use the components directly as if they are already defined.

1. First, try to use existing components from the provided list. Use kebab-case for component names (e.g., "ardacity-builder", "floating-navbar").
2. If you need a component that doesn't exist in the list, generate a complete React functional component for it.
3. For each missing component, provide both the component suggestion AND the complete React code.
4. IMPORTANT: For any custom component, generate a plain React functional component in JavaScript (not TypeScript), and do NOT include any import or export statements. Assume React is already in scope. The component should be a function definition only, e.g.:

function MyComponent({ prop1, prop2 }) {
  return <div>...</div>;
}

5. THEME RESTRICTIONS: For any custom component, you MUST use only the following Tailwind classes for colors and backgrounds:
- bg-black, bg-zinc-900, text-white, border-zinc-800, and similar (from the zinc palette only)
- Only use dark mode styles (do not use light backgrounds or text)
- Do NOT use any other color classes (no blue, red, green, etc)
- Do NOT use light backgrounds or text
- All components must look good in a dark UI with black, white, and zinc as the only colors

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
      "type": "exported function name",
      "category": "ui",
      "props": {
        "title": "Example Title"
      },
      "code": "function DescriptiveComponent({ title }) { return <div>{title}</div>; }"
    }
  ]
}

Only use component names from the provided list when possible. For missing components, generate clean, functional React components as described above.`
          }]
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
      // Remove duplicate component types from both arrays
      if (result.components && Array.isArray(result.components)) {
        const seenTypes = new Set();
        result.components = result.components.filter((comp: any) => {
          if (!comp || !comp.type) return false;
          if (seenTypes.has(comp.type)) return false;
          seenTypes.add(comp.type);
          return true;
        });
      }
      if (result.generatedComponents && Array.isArray(result.generatedComponents)) {
        const seenTypes = new Set();
        result.generatedComponents = result.generatedComponents.filter((comp: any) => {
          if (!comp || !comp.type) return false;
          if (seenTypes.has(comp.type)) return false;
          seenTypes.add(comp.type);
          return true;
        });
      }
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