import { useCallback } from 'react';
import {
  getCodeSnippetFromCerebras,
  getCodeSnippetFromGroq,
  getCodeSnippetFromOpenAI,
} from './getCodeSnippet';
import { handleGeneratedCodeSnippet } from './handleGeneratedCodeSnippet';

export function useRunPromptToCodeSnippet(aiServiceSlug: 'groq' | 'openai' | 'cerebras') {
  function getCodeSnippet(prompt: string) {
    switch (aiServiceSlug) {
      case 'openai':
        return getCodeSnippetFromOpenAI(prompt);
      case 'groq':
        return getCodeSnippetFromGroq(prompt);
      case 'cerebras':
        return getCodeSnippetFromCerebras(prompt);
    }
  }
  
  const runPrompt = useCallback(async (prompt: string) => {
    const snippet = await getCodeSnippet(prompt);
    console.log('📜 Received code snippet:', snippet);

    try {
      return await handleGeneratedCodeSnippet(snippet);
    } catch (error) {
      console.error('❌ Error handling generated code snippet:', error);
    }
  }, []);

  return runPrompt;
}
