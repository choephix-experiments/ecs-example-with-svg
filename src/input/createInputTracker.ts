type MouseButton = 'left' | 'right' | 'middle';

interface InputTracker {
  isKeyPressed: (key: string) => boolean;
  isMouseButtonPressed: (button: MouseButton) => boolean;
  getMousePosition: () => { x: number; y: number };
  getAxis: (axisName: string) => number;
}

export function createInputTracker(): InputTracker {
  const pressedKeys = new Set<string>();
  const pressedMouseButtons = new Set<MouseButton>();
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('keydown', (e) => {
    pressedKeys.add(e.key.toLowerCase());
    console.debug(`🎹 Key pressed: ${e.key}`);
  });

  window.addEventListener('keyup', (e) => {
    pressedKeys.delete(e.key.toLowerCase());
    console.debug(`🎹 Key released: ${e.key}`);
  });

  window.addEventListener('mousedown', (e) => {
    const button = getMouseButtonName(e.button);
    if (button) pressedMouseButtons.add(button);
    console.debug(`🖱️ Mouse button pressed: ${button}`);
  });

  window.addEventListener('mouseup', (e) => {
    const button = getMouseButtonName(e.button);
    if (button) pressedMouseButtons.delete(button);
    console.debug(`🖱️ Mouse button released: ${button}`);
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    console.debug(`🖱️ Mouse moved to: (${mouseX}, ${mouseY})`);
  });

  function getMouseButtonName(button: number): MouseButton | null {
    switch (button) {
      case 0: return 'left';
      case 1: return 'middle';
      case 2: return 'right';
      default: return null;
    }
  }

  function getAxis(axisName: string): number {
    switch (axisName.toLowerCase()) {
      case 'horizontal':
        return (pressedKeys.has('d') || pressedKeys.has('arrowright') ? 1 : 0) -
               (pressedKeys.has('a') || pressedKeys.has('arrowleft') ? 1 : 0);
      case 'vertical':
        return (pressedKeys.has('w') || pressedKeys.has('arrowup') ? 1 : 0) -
               (pressedKeys.has('s') || pressedKeys.has('arrowdown') ? 1 : 0);
      default:
        console.warn(`⚠️ Unknown axis: ${axisName}`);
        return 0;
    }
  }

  return {
    isKeyPressed: (key: string) => pressedKeys.has(key.toLowerCase()),
    isMouseButtonPressed: (button: MouseButton) => pressedMouseButtons.has(button),
    getMousePosition: () => ({ x: mouseX, y: mouseY }),
    getAxis,
  };
}

