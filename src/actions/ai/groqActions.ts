import Groq from "groq-sdk";
import { ActionsResponseSchemaType } from "../../schemas/actionSchemas";
import { buildContextString } from "./contextAndPrompting";

let groq: Groq | null = null;

const getGroqInstance = (): Groq => {
  if (!groq) {
    const storedApiKey = localStorage.getItem("groq_api_key");
    let apiKey = storedApiKey;

    if (!apiKey) {
      apiKey = prompt("Please enter your GROQ API key:");
      if (apiKey) {
        localStorage.setItem("groq_api_key", apiKey);
        console.log("🔑 API key saved to local storage");
      } else {
        console.error("❌ No API key provided");
        throw new Error("GROQ API key is required");
      }
    }

    groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    console.log("🚀 GROQ instance created");
  }

  return groq;
};

// ... existing actionsResponseSchema ...

export async function getActionsFromGroq(
  prompt: string
): Promise<ActionsResponseSchemaType> {
  const groqInstance = getGroqInstance();

  const contextStr = buildContextString();

  console.log("🤖 Sending request to GROQ");
  const completion = await groqInstance.chat.completions.create({
    model: "gemma2-9b-it",
    messages: [
      { role: "system", content: contextStr },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const contentJson = completion.choices[0]?.message?.content;
  console.log("✅ Received response from GROQ", contentJson);

  if (!contentJson) {
    throw new Error("Unexpected response format from GROQ");
  }

  const contentParsed = JSON.parse(contentJson) as ActionsResponseSchemaType;
  console.log("🤖 Received actions from GROQ:", contentParsed);

  if (Array.isArray(contentParsed.actions)) {
    return contentParsed as ActionsResponseSchemaType;
  }
  
  if (Array.isArray(contentParsed)) {
    return { actions: contentParsed } as ActionsResponseSchemaType;
  }

  if ("type" in contentParsed) {
    return { actions: [contentParsed] } as ActionsResponseSchemaType;
  }

  throw new Error("Unexpected response format from GROQ");
}
