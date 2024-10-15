import React, { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import YAML from "yaml";
import { worldDataState } from "../../stores/worldDataState";
import { ideState } from "../../stores/ideStore";

export const WorldStateInspector: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const worldData = useSnapshot(worldDataState);
  const worldDataYamlStr = YAML.stringify(worldData);
  const ideData = useSnapshot(ideState);
  const ideStateYamlStr = YAML.stringify(ideData);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "`") {
        setIsVisible((prev) => !prev);
        console.log("🔀 Toggled World State Inspector");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute top-4 left-4 max-h-[calc(100vh-32px)] overflow-y-auto bg-white rounded-lg border border-gray-300 shadow-md animate-slide-in">
      <div className="p-4 overflow-x-auto">
        <pre className="text-xs font-bold mb-2">IDE</pre>
        <pre className="text-xs whitespace-pre-wrap">{ideStateYamlStr}</pre>
        <br />
        <hr />
        <br />
        <pre className="text-xs font-bold mb-2">World</pre>
        <pre className="text-xs whitespace-pre-wrap">{worldDataYamlStr}</pre>
      </div>
    </div>
  );
};
