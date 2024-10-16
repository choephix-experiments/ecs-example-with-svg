import { magicApi } from "../ai/with-code-snippet/magicApi";
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
}
