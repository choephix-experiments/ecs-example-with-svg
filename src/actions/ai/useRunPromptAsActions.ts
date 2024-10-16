import { useCallback } from "react";
import { resolveAction } from "../actionResolver";
import { getActionsFromGroq } from "./groqActions";
import { getActionsFromOpenAI } from "./openAiActions";

export function useRunPromptAsActions(aiServiceSlug: "groq" | "openai") {
  const runPrompt = useCallback(
    async (prompt: string) => {
      const actions =
        aiServiceSlug === "groq"
          ? await getActionsFromGroq(prompt)
          : await getActionsFromOpenAI(prompt);
      console.log("🤖 Received actions from AI:", actions);

      for (const action of actions.actions) {
        await delay(100);
        resolveAction(action as any);
      }
    },
    [aiServiceSlug]
  );

  return runPrompt;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
