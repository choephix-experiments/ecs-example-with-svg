import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { getActionsFromOpenAI } from "../actions/ai/openAiActions";
import { resolveAction } from "../actions/actionResolver";

export function initDebug() {
  console.log("🚀 Debug initialized");

  Object.assign(window, {
    worldDataState,
    worldDataStateActions,
    getActionsFromOpenAI,
    go: async (prompt: string) => {
      const actions = await getActionsFromOpenAI(prompt);

      for (const action of actions.actions) {
        resolveAction(action as any);
      }
      console.log("🤖 Received actions from OpenAI:", actions);
    },
  });
}
