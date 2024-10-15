import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { getActionsFromOpenAI } from "../actions/ai/openAiActions";
import { resolveAction } from "../actions/actionResolver";
import { getActionsFromGroq } from "../actions/ai/groqActions";
import { getCodeSnippetFromOpenAI, getCodeSnippetFromGroq } from "../magic/ai/getCodeSnippet";
import { magicApi } from "../magic/magicApi";

export async function initDebugging() {
  console.log("🚀 Debug initialized");

  const services = {
    openai: getActionsFromOpenAI,
    groq: getActionsFromGroq,
  };

  const snippetServices = {
    openai: getCodeSnippetFromOpenAI,
    groq: getCodeSnippetFromGroq,
  };

  Object.assign(window, {
    worldDataState,
    worldDataStateActions,
    getActionsFromOpenAI,
    getActionsFromGroq,
    magicApi,
    go: async (prompt: string, service: keyof typeof services = "groq") => {
      const getActions = services[service];

      const actions = await getActions(prompt);

      for (const action of actions.actions) {
        await nextFrame();
        resolveAction(action as any);
      }
      console.log("🤖 Received actions from OpenAI:", actions);
    },
    snip: async (prompt: string, service: keyof typeof snippetServices = "groq") => {
      const getSnippet = snippetServices[service];
      const snippet = await getSnippet(prompt);
      console.log("📜 Received code snippet:");
      console.log(snippet);
      
      try {
        // Create a new function with magicApi in its scope
        const snippetFunction = new Function('magicApi', `
          return (async () => {
            ${snippet}
          })();
        `);
        
        // Execute the snippet function with magicApi as an argument
        const result = await snippetFunction(magicApi);
        console.log("✅ Snippet executed successfully");
        console.log("Result:", result);
      } catch (error) {
        console.error("❌ Error executing snippet:", error);
      }
    },
  });
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
