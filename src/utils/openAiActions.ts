import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { ActionsResponseSchema } from "../schemas/actionSchemas";

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

export async function getActionsFromOpenAI(prompt: string) {
  const openaiInstance = getOpenAIInstance();

  console.log('🤖 Sending request to OpenAI');
  const completion = await openaiInstance.chat.completions.create({
    model: "gpt-4o", // Replace with the appropriate model
    messages: [
      { role: "system", content: "You are an AI assistant that generates actions for a game engine. Respond with a list of actions based on the user's request." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(ActionsResponseSchema, "actions_response"),
  });

  console.log('✅ Received response from OpenAI');
  return completion.choices[0].message.content;
}
