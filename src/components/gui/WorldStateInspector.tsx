import React, { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import YAML from 'yaml';
import { worldDataState } from '../../stores/worldDataState';

export const WorldStateInspector: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const worldData = useSnapshot(worldDataState);
  const yamlString = YAML.stringify(worldData);

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
    <div className="absolute top-0 left-0 h-full overflow-y-auto bg-white bg-opacity-50 border-r border-gray-300 shadow-md">
      <div className="p-4 h-full">
        <pre className="text-xs font-bold mb-2">World State Inspector</pre>
        <pre className="text-xs whitespace-pre-wrap overflow-x-auto h-[calc(100%-1rem)]">{yamlString}</pre>
      </div>
    </div>
  );
};
