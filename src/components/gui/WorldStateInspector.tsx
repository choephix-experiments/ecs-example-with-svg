import React, { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import YAML from 'yaml';
import { worldDataState } from '../../stores/worldDataState';
import { ideState } from '../../stores/ideStore';

export const WorldStateInspector: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const worldData = useSnapshot(worldDataState);
  const worldDataYamlStr = YAML.stringify(worldData);
  const ideData = useSnapshot(ideState);
  const ideStateYamlStr = YAML.stringify(ideData);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '`') {
        setIsVisible(prev => !prev);
        console.log('🔀 Toggled World State Inspector');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute top-0 left-0 h-full overflow-y-auto bg-white bg-opacity-90 border-r border-gray-300 shadow-md">
      <div className="py-4 px-8 h-full overflow-x-auto">
        <hr/>
        <br/>
        <pre className="text-xs font-bold mb-2">IDE</pre>
        <pre className="text-xs whitespace-pre-wrap">{ideStateYamlStr}</pre>
        <br/>
        <hr/>
        <br/>
        <pre className="text-xs font-bold mb-2">World</pre>
        <pre className="text-xs whitespace-pre-wrap">{worldDataYamlStr}</pre>
        <br/>
        <hr/>
      </div>
    </div>
  );
};
