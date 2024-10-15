import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { getActionsFromOpenAI } from "../actions/ai/openAiActions";
import { resolveAction } from "../actions/actionResolver";
import { getActionsFromGroq } from "../actions/ai/groqActions";

export async function initDebugging() {
  console.log("🚀 Debug initialized");

  const services = {
    openai: getActionsFromOpenAI,
    groq: getActionsFromGroq,
  };

  Object.assign(window, {
    worldDataState,
    worldDataStateActions,
    getActionsFromOpenAI,
    getActionsFromGroq,
    go: async (prompt: string, service: keyof typeof services = "groq") => {
      const getActions = services[service];

      const actions = await getActions(prompt);

      for (const action of actions.actions) {
        await nextFrame();
        resolveAction(action as any);
      }
      console.log("🤖 Received actions from OpenAI:", actions);
    },
  });
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));