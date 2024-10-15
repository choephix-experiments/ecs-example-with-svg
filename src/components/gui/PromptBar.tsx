import { SparkleIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function PromptBar() {
  const [prompt, setPrompt] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const shouldExpand = prompt.length > 30 || prompt.includes("\n");
    setIsExpanded(shouldExpand);

    if (textareaRef.current) {
      // Reset height to auto before calculating scrollHeight
      textareaRef.current.style.height = 'auto';
      const newHeight = shouldExpand 
        ? `${Math.max(textareaRef.current.scrollHeight, 96)}px`
        : '40px';
      textareaRef.current.style.height = newHeight;
    }
  }, [prompt]);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Prompt submitted:", prompt);
    setPrompt("");
  };

  return (
    <form
      onSubmit={handlePromptSubmit}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
          placeholder="Enter prompt..."
          className={`w-full px-4 py-2 rounded-3xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300 ease-in-out ${
            isExpanded ? "h-auto min-h-[6rem] text-xs" : "h-10 overflow-hidden"
          }`}
        />
        <button type="submit" className="absolute right-3 top-3">
          <SparkleIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </form>
  );
}
