import { useState } from "react";
import { useSnapshot } from "valtio";
import { useRunPromptToCodeSnippet } from "../../magic/ai/useRunPromptToCodeSnippet";
import { ideState, ideStateActions } from "../../stores/ideStore";
import { FlexibleBar } from "../gui/FlexibleBar";

const mode = "snippet" as "snippet" | "actions" | "mock";

export function PromptBar() {
  const { aiBusy } = useSnapshot(ideState);
  const [error, setError] = useState<string | null>(null);
  const runPrompt = useRunPrompt();

  const handlePromptSubmit = async (prompt: string) => {
    console.log("🚀 Prompt submitted:", prompt);
    setError(null);

    try {
      ideStateActions.setAIBusy(true);
      await runPrompt(prompt);
    } catch (error) {
      console.error("❌ Error processing AI snippet:", error);
      setError(String(error));
    } finally {
      ideStateActions.setAIBusy(false);
    }
  };

  return (
    <FlexibleBar
      onSubmit={handlePromptSubmit}
      disabled={aiBusy}
      error={error}
    />
  );
}

function useRunPrompt() {
  const searchParams = new URL(window.location.href).searchParams;
  const aiServiceSlug = searchParams.get("ai") as "groq" | "openai";
  if (mode === "snippet") return useRunPromptToCodeSnippet(aiServiceSlug);
  if (mode === "actions") return useRunPromptToCodeSnippet(aiServiceSlug);
  return useRunPromptFakely();
}

function useRunPromptFakely() {
  return async (prompt: string) => {
    console.log("🚀 Prompt submitted:", prompt);
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (prompt.includes("throw")) {
      throw new Error(
        "This is a test error. Here's a random JSON object: " +
          JSON.stringify({
            message: "This is a test error",
            timestamp: new Date().toISOString(),
          })
      );
    }
    console.log("🚀 Prompt executed:", prompt);
  };
}
