import React, { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import YAML from "yaml";
import { debugDataState } from "../../stores/debugDataStore";

export const DebugDataInspector: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { values } = useSnapshot(debugDataState);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "-") {
        setIsVisible((prev) => !prev);
        console.log("🔀 Toggled Debug Data Inspector");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute top-4 left-4 max-h-[calc(100vh-32px)] overflow-y-auto bg-white rounded-lg border border-gray-300 shadow-md animate-slide-in">
      <div className="p-4 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Debug Data</h2>
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h3 className="text-xs font-bold mb-1">{key}</h3>
            <pre className="text-xs whitespace-pre-wrap">
              {typeof value === "string" || typeof value === "number"
                ? value
                : YAML.stringify(value)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
