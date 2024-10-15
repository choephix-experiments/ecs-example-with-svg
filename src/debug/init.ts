import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { getActionsFromOpenAI } from "../actions/ai/openAiActions";

export function initDebug() {
  console.log("🚀 Debug initialized");

  Object.assign(window, {
    worldDataState,
    worldDataStateActions,
    getActionsFromOpenAI,
  });
}
