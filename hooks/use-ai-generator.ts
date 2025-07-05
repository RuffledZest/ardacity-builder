import { useState } from 'react';
import { useComponents } from '@/components/builder/component-context';
import type { GeneratedComponent } from '@/lib/dynamic-component-compiler';

interface AIGenerationResult {
  components: Array<{
    type: string;
    category: string;
    props: Record<string, any>;
  }>;
  generatedComponents: GeneratedComponent[];
}

interface UseAIGeneratorReturn {
  isGenerating: boolean;
  error: string | null;
  generateComponents: (prompt: string) => Promise<void>;
  lastResult: AIGenerationResult | null;
}

export function useAIGenerator(): UseAIGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AIGenerationResult | null>(null);
  
  const { addComponent, addGeneratedComponents } = useComponents();

  const generateComponents = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the result from the API response
      const result = data.result || { components: [], generatedComponents: [] };
      setLastResult(result);

      // Add regular components from the library
      if (result.components && Array.isArray(result.components)) {
        result.components.forEach((component: any) => {
          addComponent({
            type: component.type,
            category: component.category,
            props: component.props,
            position: { x: 0, y: 0 }
          });
        });
      }

      // Add generated components (these will be compiled and registered automatically)
      if (result.generatedComponents && Array.isArray(result.generatedComponents)) {
        addGeneratedComponents(result.generatedComponents);
      }

      console.log('AI generation completed:', result);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AI generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    generateComponents,
    lastResult,
  };
} 