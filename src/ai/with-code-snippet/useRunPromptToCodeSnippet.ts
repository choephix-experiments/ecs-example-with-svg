import { useCallback } from "react";
import {
  getCodeSnippetFromGroq,
  getCodeSnippetFromOpenAI,
} from "./getCodeSnippet";
import { handleGeneratedCodeSnippet } from "./handleGeneratedCodeSnippet";

export function useRunPromptToCodeSnippet(aiServiceSlug: "groq" | "openai") {
  const runPrompt = useCallback(async (prompt: string) => {
    const snippet =
      aiServiceSlug === "openai"
        ? await getCodeSnippetFromOpenAI(prompt)
        : await getCodeSnippetFromGroq(prompt);
    console.log("📜 Received code snippet:", snippet);

    try {
      return await handleGeneratedCodeSnippet(snippet);
    } catch (error) {
      console.error("❌ Error handling generated code snippet:", error);
    }
  }, []);

  return runPrompt;
}
