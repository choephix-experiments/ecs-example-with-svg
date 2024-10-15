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

export async function getCodeSnippetFromOpenAI(prompt: string): Promise<string> {
  const openaiInstance = getOpenAIInstance();
  const systemPrompt = createSystemPrompt();

  console.log("🤖 Sending request to OpenAI");
  const completion = await openaiInstance.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  console.log("✅ Received response from OpenAI");
  return completion.choices[0].message.content || "";
}

export async function getCodeSnippetFromGroq(prompt: string): Promise<string> {
  const groqInstance = getGroqInstance();
  const systemPrompt = createSystemPrompt();

  console.log("🤖 Sending request to GROQ");
  const completion = await groqInstance.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  console.log("✅ Received response from GROQ");
  return completion.choices[0].message.content || "";
}
