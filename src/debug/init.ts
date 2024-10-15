import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { getActionsFromOpenAI } from "../actions/ai/openAiActions";
import { resolveAction } from "../actions/actionResolver";
import { getActionsFromGroq } from "../actions/ai/groqActions";

export function initDebug() {
  console.log("🚀 Debug initialized");

  Object.assign(window, {
    worldDataState,
    worldDataStateActions,
    getActionsFromOpenAI,
    getActionsFromGroq,
    go: async (prompt: string) => {
      // const actions = await getActionsFromOpenAI(prompt);
      const actions = await getActionsFromGroq(prompt);

      for (const action of actions.actions) {
        resolveAction(action as any);
      }
      console.log("🤖 Received actions from OpenAI:", actions);
    },
  });
}
