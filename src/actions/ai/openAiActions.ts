import OpenAI from "openai";
import { ActionsResponseSchemaType } from "../../schemas/actionSchemas";
import { buildContextString, contextAndPrompting } from "./contextAndPrompting";
import { worldDataState } from "../../stores/worldDataState";
import { ideState } from "../../stores/ideStore";

let openai: OpenAI | null = null;

const getOpenAIInstance = (): OpenAI => {
  if (!openai) {
    const storedApiKey = localStorage.getItem("openai_api_key");
    let apiKey = storedApiKey;

    if (!apiKey) {
      apiKey = prompt("Please enter your OpenAI API key:");
      if (apiKey) {
        localStorage.setItem("openai_api_key", apiKey);
        console.log("🔑 API key saved to local storage");
      } else {
        console.error("❌ No API key provided");
        throw new Error("OpenAI API key is required");
      }
    }

    openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    console.log("🚀 OpenAI instance created");
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

export async function getActionsFromOpenAI(
  prompt: string
): Promise<ActionsResponseSchemaType> {
  const openaiInstance = getOpenAIInstance();

  const contextStr = buildContextString();

  console.log("🤖 Sending request to OpenAI");
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

  console.log("✅ Received response from OpenAI");
  const functionCall = completion.choices[0].message.function_call;
  if (functionCall && functionCall.name === "generate_actions") {
    return JSON.parse(
      functionCall.arguments || "{}"
    ) as ActionsResponseSchemaType;
  } else {
    throw new Error("Unexpected response format from OpenAI");
  }
}
