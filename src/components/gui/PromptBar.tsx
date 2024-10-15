import { SparkleIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { ideState, ideStateActions } from "../../stores/ideStore";
import { getActionsFromGroq } from "../../actions/ai/groqActions";
import { resolveAction } from "../../actions/actionResolver";
import { getActionsFromOpenAI } from "../../actions/ai/openAiActions";

export function PromptBar() {
  const [prompt, setPrompt] = useState("");
  const { aiBusy } = useSnapshot(ideState);

  const ai = new URL(window.location.href).searchParams.get("ai");

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiBusy || !prompt.trim()) return;

    console.log("🚀 Prompt submitted:", prompt);
    ideStateActions.setAIBusy(true);

    try {
      const actions =
        ai === "groq"
          ? await getActionsFromGroq(prompt)
          : await getActionsFromOpenAI(prompt);
      console.log("🤖 Received actions from AI:", actions);

      for (const action of actions.actions) {
        await delay(100);
        resolveAction(action as any);
      }

      setPrompt("");
    } catch (error) {
      console.error("❌ Error processing AI actions:", error);
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

function FlexibleBar({
  prompt,
  setPrompt,
  onSubmit,
  disabled,
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const shouldExpand = prompt.length > 30 || prompt.includes("\n");
    setIsExpanded(shouldExpand);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = shouldExpand
        ? `${Math.max(textareaRef.current.scrollHeight, 96)}px`
        : "40px";
      textareaRef.current.style.height = newHeight;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 select-none"
    >
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          isExpanded ? "w-[32rem]" : "w-96"
        }`}
      >
        <textarea
          rows={1}
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter prompt..."
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-3xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300 ease-in-out ${
            isExpanded ? "h-auto min-h-[6rem] text-xs" : "h-10 overflow-hidden"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        <button
          type="submit"
          className="absolute right-3 top-3"
          disabled={disabled}
        >
          {disabled ? (
            <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
          ) : (
            <SparkleIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
    </form>
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
