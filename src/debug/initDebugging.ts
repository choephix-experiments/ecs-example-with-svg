import { magicApi } from "../ai/with-code-snippet/magicApi";
import { createInputTracker } from "../input/createInputTracker";
import { debugDataState } from "../stores/debugDataStore";
import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";

export async function initDebugging() {
  console.log("🚀 Debug initialized");

  Object.assign(window, {
    worldDataState,
    worldDataStateActions,
    magicApi,
  });

  const input = createInputTracker();
  const loop = function () {
    debugDataState.values.inputStats = `
      isPressed[Shift]: ${input.isKeyPressed("Shift")}
      isPressed[Control]: ${input.isKeyPressed("Control")}
      isPressed[Alt]: ${input.isKeyPressed("Alt")}
      isPressed[Meta]: ${input.isKeyPressed("Meta")}
      isPressed[Enter]: ${input.isKeyPressed("Enter")}
      isPressed[Space]: ${input.isKeyPressed(" ")}
      isPressed[Backspace]: ${input.isKeyPressed("Backspace")}
      isPressed[ArrowUp]: ${input.isKeyPressed("ArrowUp")}
      isPressed[ArrowDown]: ${input.isKeyPressed("ArrowDown")}
      isPressed[ArrowLeft]: ${input.isKeyPressed("ArrowLeft")}
      isPressed[ArrowRight]: ${input.isKeyPressed("ArrowRight")}
      isPressed[Mouse:left]: ${input.isMouseButtonPressed("left")}
      isPressed[Mouse:middle]: ${input.isMouseButtonPressed("middle")}
      isPressed[Mouse:right]: ${input.isMouseButtonPressed("right")}
      axis[Horizontal]: ${input.getAxis("Horizontal")}
      axis[Vertical]: ${input.getAxis("Vertical")}
      mousePosition: 
        ${input.getMousePosition().x} x ${input.getMousePosition().y}
    `;
    requestAnimationFrame(loop);
  };
  loop();
}
