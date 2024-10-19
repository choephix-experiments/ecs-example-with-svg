import { useCallback } from 'react';
import { getCodeSnippet } from './getCodeSnippet';
import { handleGeneratedCodeSnippet } from './handleGeneratedCodeSnippet';

export function useRunPromptToCodeSnippet(aiServiceSlug: 'groq' | 'openai' | 'cerebras' | 'mock') {
  const runPrompt = useCallback(async (prompt: string) => {
    const snippet = await getCodeSnippet(prompt, aiServiceSlug);
    console.log('📜 Received code snippet:', snippet);

    try {
      return await handleGeneratedCodeSnippet(snippet);
    } catch (error) {
      console.error('❌ Error handling generated code snippet:', error);
    }
  }, []);

  return runPrompt;
}
