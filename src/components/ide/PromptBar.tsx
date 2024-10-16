import { useState } from "react";
import { useSnapshot } from "valtio";
import { useRunPromptToCodeSnippet } from "../../magic/ai/useRunPromptToCodeSnippet";
import { ideState } from "../../stores/ideStore";
import { FlexibleBar } from "../gui/FlexibleBar";
import { ideStateActions } from "../../stores/ideStore";

const mode = "mock" as "snippet" | "actions" | "mock";

export function PromptBar() {
  const { aiBusy } = useSnapshot(ideState);

  const aiServiceSlug = new URL(window.location.href).searchParams.get("ai");
  const runPromptToCodeSnippet =
    mode === "snippet"
      ? useRunPromptToCodeSnippet(aiServiceSlug as "groq" | "openai")
      : mode === "actions"
      ? useRunPromptToCodeSnippet(aiServiceSlug as "groq" | "openai")
      : useRunPromptFakely();

  if (!runPromptToCodeSnippet) {
    return null;
  }

  const handlePromptSubmit = async (prompt: string) => {
    console.log("🚀 Prompt submitted:", prompt);

    try {
      ideStateActions.setAIBusy(true);
      await runPromptToCodeSnippet(prompt);
    } catch (error) {
      console.error("❌ Error processing AI snippet:", error);
    } finally {
      ideStateActions.setAIBusy(false);
    }
  };

  return (
    <FlexibleBar
      onSubmit={handlePromptSubmit}
      disabled={aiBusy}
    />
  );
}

function useRunPromptFakely() {
  return async (prompt: string) => {
    console.log("🚀 Prompt submitted:", prompt);
    await new Promise((resolve) => setTimeout(resolve, 250));
    console.log("🚀 Prompt executed:", prompt);
  };
}
