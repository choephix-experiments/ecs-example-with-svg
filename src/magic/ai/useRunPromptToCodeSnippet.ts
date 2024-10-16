import { useCallback } from "react";
import { ideStateActions } from "../../stores/ideStore";
import {
  getCodeSnippetFromGroq,
  getCodeSnippetFromOpenAI,
} from "./getCodeSnippet";
import { magicApi } from "../magicApi";

export function useRunPromptToCodeSnippet(aiServiceSlug: "groq" | "openai") {
  const runPrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    console.log("🚀 Prompt submitted:", prompt);
    ideStateActions.setAIBusy(true);

    try {
      const snippet =
        aiServiceSlug === "openai"
          ? await getCodeSnippetFromOpenAI(prompt)
          : await getCodeSnippetFromGroq(prompt);

      console.log("📜 Received code snippet:", snippet);

      try {
        // Create a new function with magicApi in its scope
        const snippetFunction = new Function(
          "magicApi",
          `
          return (async () => {
            ${snippet}
          })();
        `
        );

        // Execute the snippet function with magicApi as an argument
        const result = await snippetFunction(magicApi);
        console.log("✅ Snippet executed successfully");
        console.log("🔍 Result:", result);
        return result;
      } catch (error) {
        console.error("❌ Error executing snippet:", error);
      }
    } catch (error) {
      console.error("❌ Error processing AI snippet:", error);
    } finally {
      ideStateActions.setAIBusy(false);
    }
  }, []);

  return runPrompt;
}
