import { useCallback } from "react";
import { ideStateActions } from "../../stores/ideStore";
import { resolveAction } from "../actionResolver";
import { getActionsFromGroq } from "./groqActions";
import { getActionsFromOpenAI } from "./openAiActions";

export function useRunPromptAsActions(aiServiceSlug: "groq" | "openai") {
  const runPrompt = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;

      console.log("🚀 Prompt submitted:", prompt);
      ideStateActions.setAIBusy(true);

      try {
        const actions =
          aiServiceSlug === "groq"
            ? await getActionsFromGroq(prompt)
            : await getActionsFromOpenAI(prompt);
        console.log("🤖 Received actions from AI:", actions);

        for (const action of actions.actions) {
          await delay(100);
          resolveAction(action as any);
        }
      } catch (error) {
        console.error("❌ Error processing AI actions:", error);
      } finally {
        ideStateActions.setAIBusy(false);
      }
    },
    [aiServiceSlug]
  );

  return runPrompt;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
