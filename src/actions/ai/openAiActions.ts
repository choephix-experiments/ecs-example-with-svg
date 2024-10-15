import OpenAI from "openai";
import { ActionsResponseSchemaType } from "../../schemas/actionSchemas";
import { contextAndPrompting } from "./contextAndPrompting";
import { worldDataState } from "../../stores/worldDataState";
import { ideState } from "../../stores/ideStore";

let openai: OpenAI | null = null;

const getOpenAIInstance = (): OpenAI => {
  if (!openai) {
    const storedApiKey = localStorage.getItem('openai_api_key');
    let apiKey = storedApiKey;

    if (!apiKey) {
      apiKey = prompt('Please enter your OpenAI API key:');
      if (apiKey) {
        localStorage.setItem('openai_api_key', apiKey);
        console.log('🔑 API key saved to local storage');
      } else {
        console.error('❌ No API key provided');
        throw new Error('OpenAI API key is required');
      }
    }

    openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    console.log('🚀 OpenAI instance created');
  }

  return openai;
};

const actionsResponseSchema = {
  type: "object",
  properties: {
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          entityProps: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              rotation: { type: "number" },
              scale: { type: "number" },
              behaviors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    name: { type: "string" },
                  },
                  required: ["uuid", "type"],
                },
              },
            },
            required: ["uuid", "x", "y", "rotation", "scale", "behaviors"],
          },
          entityId: { type: "string" },
          updates: { type: "object" },
          behaviorProps: { type: "object" },
          behaviorType: { type: "string" },
          entityIds: { type: "array", items: { type: "string" } },
        },
        required: ["type"],
      },
    },
  },
  required: ["actions"],
};

export async function getActionsFromOpenAI(prompt: string): Promise<ActionsResponseSchemaType> {
  const openaiInstance = getOpenAIInstance();

  const stageWidth = worldDataState.stage.width;
  const stageHeight = worldDataState.stage.height;
  const stageBounds = `
    - top left corner: ${-stageWidth / 2}x${-stageHeight / 2}.
    - bottom right corner: ${stageWidth / 2}x${stageHeight / 2}.
  `;

  const entitiesInWorld = worldDataState.entities.map(entity => `
    - ${entity.uuid}:
      - x: ${entity.x}
      - y: ${entity.y}
      - rotation: ${entity.rotation}
      - scale: ${entity.scale}
      - behaviors: ${JSON.stringify(entity.behaviors, null, 2)}
  `).join("\n");

  const contextStr = `
    You are an AI assistant that generates actions for a game engine.
    You can add, remove, update entities, behaviors, and select/deselect entities.
    You can also clear the world, clear the selection, and generate actions based on user's request.

    An action resolver will parse your json response and execute the actions.

    Here are the action types you can use:
    ${contextAndPrompting.actionTypes}

    Here are the built-in behaviors you can use:
    ${contextAndPrompting.builtInBehaviors}

    Current state of the world:
    
    Stage bounds: ${stageBounds}

    Entities in the world: ${entitiesInWorld}

    Current selection (entity ids): ${ideState.selectedEntityIds.join(", ")}
  `;

  console.log('🤖 Sending request to OpenAI');
  const completion = await openaiInstance.chat.completions.create({
    model: "gpt-4o-mini", // Use an available model
    messages: [
      { role: "system", content: contextStr },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    functions: [
      {
        name: "generate_actions",
        description: "Generate a list of actions based on the user's request",
        parameters: actionsResponseSchema,
      },
    ],
    function_call: { name: "generate_actions" },
  });

  console.log('✅ Received response from OpenAI');
  const functionCall = completion.choices[0].message.function_call;
  if (functionCall && functionCall.name === "generate_actions") {
    return JSON.parse(functionCall.arguments || "{}") as ActionsResponseSchemaType;
  } else {
    throw new Error("Unexpected response format from OpenAI");
  }
}
