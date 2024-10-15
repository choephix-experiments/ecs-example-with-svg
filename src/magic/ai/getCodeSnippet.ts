import OpenAI from "openai";
import Groq from "groq-sdk";
import { createSystemPrompt } from "./createSystemPrompt";

let openai: OpenAI | null = null;
let groq: Groq | null = null;

const getOpenAIInstance = (): OpenAI => {
  if (!openai) {
    const apiKey = localStorage.getItem("openai_api_key") || prompt("Please enter your OpenAI API key:");
    if (!apiKey) throw new Error("OpenAI API key is required");
    localStorage.setItem("openai_api_key", apiKey);
    openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    console.log("🚀 OpenAI instance created");
  }
  return openai;
};

const getGroqInstance = (): Groq => {
  if (!groq) {
    const apiKey = localStorage.getItem("groq_api_key") || prompt("Please enter your GROQ API key:");
    if (!apiKey) throw new Error("GROQ API key is required");
    localStorage.setItem("groq_api_key", apiKey);
    groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    console.log("🚀 GROQ instance created");
  }
  return groq;
};

const snippetResponseSchema = {
  type: "object",
  properties: {
    snippet: {
      type: "string",
      description: "The JavaScript code snippet to be executed",
    },
  },
  required: ["snippet"],
};

export async function getCodeSnippetFromOpenAI(prompt: string): Promise<string> {
  const openaiInstance = getOpenAIInstance();
  const systemPrompt = createSystemPrompt();

  console.log("🤖 Sending request to OpenAI");
  const completion = await openaiInstance.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    // response_format: { type: "json_object" },
    functions: [
      {
        name: "generate_snippet",
        description: "Generate a JavaScript code snippet based on the user's request/",
        parameters: snippetResponseSchema,
      },
    ],
    function_call: { name: "generate_snippet" },
  });

  console.log("✅ Received response from OpenAI");
  const functionCall = completion.choices[0].message.function_call;
  if (functionCall && functionCall.name === "generate_snippet") {
    const snippetResponse = JSON.parse(functionCall.arguments || "{}");
    return snippetResponse.snippet || "";
  } else {
    throw new Error("Unexpected response format from OpenAI");
  }
}

export async function getCodeSnippetFromGroq(prompt: string): Promise<string> {
  const groqInstance = getGroqInstance();
  const systemPrompt = `${createSystemPrompt()}

Please generate a JavaScript code snippet based on the user's request. Your response should be a JSON object that strictly adheres to the following schema:

${JSON.stringify(snippetResponseSchema, null, 2)}

Respond only with the JSON object, without any additional text.`;

  console.log("🤖 Sending request to GROQ");
  const completion = await groqInstance.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  console.log("✅ Received response from GROQ");
  const contentJson = completion.choices[0]?.message?.content;
  if (!contentJson) {
    throw new Error("Unexpected response format from GROQ");
  }

  const snippetResponse = JSON.parse(contentJson);
  return snippetResponse.snippet || "";
}
