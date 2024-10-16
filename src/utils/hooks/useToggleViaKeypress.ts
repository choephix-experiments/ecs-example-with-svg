import { useState, useEffect, useCallback } from 'react';

export const useToggleViaKeypress = (...keys: string[]) => {
  const [flag, setFlag] = useState(false);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (keys.includes(event.key)) {
      setFlag((prev) => !prev);
      console.log(`🔀 Toggled state (keys: ${keys.join(', ')})`);
    }
  }, [keys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return [flag, setFlag] as const;
};