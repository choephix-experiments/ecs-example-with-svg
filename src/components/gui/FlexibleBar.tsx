import { Loader2, SparkleIcon, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function FlexibleBar({
  onSubmit,
  disabled,
  error,
}: {
  onSubmit: (prompt: string) => unknown | Promise<unknown>;
  disabled: boolean;
  error: string | null;
}) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const promptHistory = usePromptHistory(prompt, setPrompt);
  const autoResize = useAutoResize(textareaRef, prompt);
  useAutoFocus(textareaRef, disabled);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    promptHistory.handleChange();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !prompt.trim()) return;

    await onSubmit(prompt);

    promptHistory.handleSubmit(prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }

    promptHistory.handleKeyDown(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 select-none"
    >
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          autoResize.isExpanded ? "w-[32rem]" : "w-96"
        }`}
      >
        {error && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-red-100 text-red-800 rounded-md flex items-center space-x-2 text-sm shadow-md z-50 w-screen max-w-screen-md">
            <pre className="text-xs whitespace-pre-wrap w-full">{error}</pre>
          </div>
        )}
        <textarea
          rows={1}
          ref={textareaRef}
          value={prompt}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter prompt..."
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-3xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300 ease-in-out ${
            autoResize.isExpanded
              ? "h-auto min-h-[6rem] text-xs"
              : "h-10 min-h-[1rem] overflow-hidden"
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

// New hooks (in the same file for now, but can be moved to separate files later)

function useAutoResize(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  prompt: string
) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return { isExpanded };
}

function useAutoFocus(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  disabled: boolean
) {
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
      console.log("🎯 Textarea focused after submission");
    }
  }, [disabled, textareaRef]);
}

function usePromptHistory(prompt: string, setPrompt: (value: string) => void) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempPrompt, setTempPrompt] = useState("");

  const navigateHistory = (direction: "up" | "down") => {
    if (history.length === 0) return;

    let newIndex = historyIndex;
    if (direction === "up" && historyIndex < history.length - 1) {
      newIndex++;
    } else if (direction === "down" && historyIndex > -1) {
      newIndex--;
    }

    setHistoryIndex(newIndex);

    if (newIndex === -1) {
      setPrompt(tempPrompt);
    } else {
      if (historyIndex === -1) {
        setTempPrompt(prompt);
      }
      setPrompt(history[history.length - 1 - newIndex]);
    }
  };

  const handleSubmit = (prompt: string) => {
    if (prompt.trim() !== "") {
      setHistory((prevHistory) => [...prevHistory, prompt]);
      console.log("🔄 Added to history:", prompt);
    }
    setHistoryIndex(-1);
    setTempPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory(e.key === "ArrowUp" ? "up" : "down");
    }
  };

  const handleChange = () => {
    setHistoryIndex(-1);
  };

  return { handleKeyDown, handleSubmit, handleChange };
}
