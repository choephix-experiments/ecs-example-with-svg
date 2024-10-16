import { useState } from "react";
import { useSnapshot } from "valtio";
import { useRunPromptToCodeSnippet } from "../../magic/ai/useRunPromptToCodeSnippet";
import { ideState } from "../../stores/ideStore";
import { FlexibleBar } from "../gui/FlexibleBar";
import { ideStateActions } from "../../stores/ideStore";

const mode = "snippet" as "snippet" | "actions" | "mock";

export function PromptBar() {
  const [prompt, setPrompt] = useState("");
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

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (aiBusy || !prompt.trim()) return;
    
    console.log("🚀 Prompt submitted:", prompt);

    try {
      ideStateActions.setAIBusy(true);
      await runPromptToCodeSnippet(prompt);
      setPrompt("");
    } catch (error) {
      console.error("❌ Error processing AI snippet:", error);
    } finally {
      ideStateActions.setAIBusy(false);
    }
  };

  return (
    <FlexibleBar
      prompt={prompt}
      setPrompt={setPrompt}
      onSubmit={handlePromptSubmit}
      disabled={aiBusy}
    />
  );
}

function useRunPromptFakely() {
  return async (prompt: string) => {
    console.log("🚀 Prompt submitted:", prompt);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("🚀 Prompt executed:", prompt);
  };
}
