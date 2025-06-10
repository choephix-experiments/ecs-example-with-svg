import Groq from "groq-sdk";
import { ActionsResponseSchemaType } from "./actionSchemas";
import { buildContextString } from "./contextAndPrompting";
import { simplifiedActionsResponseSchema } from "../../ai/with-actions/simplifiedActionsResponseSchema";

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

export async function getActionsFromGroq(
  prompt: string
): Promise<ActionsResponseSchemaType> {
  const groqInstance = getGroqInstance();

  const schema = JSON.stringify(simplifiedActionsResponseSchema);
  const contextStr = `${buildContextString()}

Please generate a list of actions based on the user's request. Your response should be a JSON object that strictly adheres to the following schema:

${schema}

Respond only with the JSON object, without any additional text.`;

  console.log("🤖 Sending request to GROQ");
  const completion = await groqInstance.chat.completions.create({
    model: "mixtral-8x7b-32768",
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

  if (Array.isArray(contentParsed.actions)) {
    return contentParsed as ActionsResponseSchemaType;
  }

  if (Array.isArray(contentParsed)) {
    return { actions: contentParsed } as ActionsResponseSchemaType;
  }

  if ("type" in contentParsed) {
    return { actions: [contentParsed] } as ActionsResponseSchemaType;
  }

  console.log("🧩 Parsed actions from GROQ:", contentParsed);
  throw new Error("Failed to parse GROQ response");
}
