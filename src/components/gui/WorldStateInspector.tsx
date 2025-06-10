import React from "react";
import { useSnapshot } from "valtio";
import YAML from "yaml";

import { ideState } from "../../stores/ideStore";
import { worldDataState } from "../../stores/worldDataState";
import { useToggleViaKeypress } from "../../utils/hooks/useToggleViaKeypress";

export const WorldStateInspector: React.FC = () => {
  const [isVisible] = useToggleViaKeypress("`");
  if (!isVisible) return null;

  return <WorldStateInspectorVisible />;
};

export const WorldStateInspectorVisible: React.FC = () => {
  const worldData = useSnapshot(worldDataState);
  const worldDataYamlStr = YAML.stringify(worldData);
  const ideData = useSnapshot(ideState);
  const ideStateYamlStr = YAML.stringify(ideData);

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
