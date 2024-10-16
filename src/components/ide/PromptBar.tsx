import { useState } from "react";
import { useSnapshot } from "valtio";
import { useRunPromptToCodeSnippet } from "../../magic/ai/useRunPromptToCodeSnippet";
import { ideState } from "../../stores/ideStore";
import { FlexibleBar } from "../gui/FlexibleBar";

export function PromptBar() {
  const [prompt, setPrompt] = useState("");
  const { aiBusy } = useSnapshot(ideState);

  const aiServiceSlug = new URL(window.location.href).searchParams.get("ai");
  const runPromptToCodeSnippet = useRunPromptToCodeSnippet(
    aiServiceSlug as "groq" | "openai"
  );

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiBusy || !prompt.trim()) return;

    await runPromptToCodeSnippet(prompt);
    setPrompt("");
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
