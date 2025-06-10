import { OpenAI } from 'openai';
import { Groq } from 'groq-sdk';
import { Cerebras } from '@cerebras/cerebras_cloud_sdk';
import { createSystemPrompt } from './createSystemPrompt';
import { createApiKeyDispenser } from '../../services/apiKeyDispenser';
import { mockSnippets } from './mockSnippets';

let openai: OpenAI | null = null;
let groq: Groq | null = null;
let cerebras: Cerebras | null = null;

const groqKeyDispenser = createApiKeyDispenser(
  'groq_api_keys',
  'Please enter your GROQ API keys (comma-separated):'
);

const openaiKeyDispenser = createApiKeyDispenser(
  'openai_api_keys',
  'Please enter your OpenAI API keys (comma-separated):'
);

const cerebrasKeyDispenser = createApiKeyDispenser(
  'cerebras_api_keys',
  'Please enter your Cerebras API keys (comma-separated):'
);

const getOpenAIInstance = (): OpenAI => {
  if (!openai) {
    const apiKey = openaiKeyDispenser.getNextApiKey();
    openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    console.log('🚀 OpenAI instance created');
  }
  return openai;
};

const getGroqInstance = (): Groq => {
  const apiKey = groqKeyDispenser.getNextApiKey();
  if (!groq || groq.apiKey !== apiKey) {
    groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    console.log('🔄 GROQ instance created with rotated API key');
  }
  return groq;
};

const getCerebrasInstance = (): Cerebras => {
  const apiKey = cerebrasKeyDispenser.getNextApiKey();
  if (!cerebras || cerebras.apiKey !== apiKey) {
    cerebras = new Cerebras({ apiKey });
    console.log('🧠 Cerebras instance created with rotated API key');
  }
  return cerebras;
};

const snippetResponseSchema = {
  type: 'object',
  properties: {
    snippet: {
      type: 'string',
      description: 'The JavaScript code snippet to be executed',
    },
  },
  required: ['snippet'],
};

export async function getCodeSnippetFromOpenAI(prompt: string): Promise<string> {
  const openaiInstance = getOpenAIInstance();
  const systemPrompt = createSystemPrompt();

  const model = new URL(window.location.href).searchParams.get('model') || 'gpt-4o-mini';

  console.log('🤖 Sending request to OpenAI');
  const completion = await openaiInstance.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    functions: [
      {
        name: 'generate_snippet',
        description: "Generate a JavaScript code snippet based on the user's request/",
        parameters: snippetResponseSchema,
      },
    ],
    function_call: { name: 'generate_snippet' },
  });

  console.log('✅ Received response from OpenAI');
  const functionCall = completion.choices[0].message.function_call;
  if (functionCall && functionCall.name === 'generate_snippet') {
    const snippetResponse = JSON.parse(functionCall.arguments || '{}');
    return snippetResponse.snippet || '';
  } else {
    throw new Error('Unexpected response format from OpenAI');
  }
}

export async function getCodeSnippetFromGroq(prompt: string): Promise<string> {
  const groqInstance = getGroqInstance();
  const systemPrompt = `${createSystemPrompt()}

Please generate a JavaScript code snippet based on the user's request. Your response should be a JSON object that strictly adheres to the following schema:

${JSON.stringify(snippetResponseSchema, null, 2)}

Respond only with the JSON object, without any additional text.`;

  //// get model from url params if any
  const model = new URL(window.location.href).searchParams.get('model') || 'mixtral-8x7b-32768';

  console.log('🤖 Sending request to GROQ');
  const completion = await groqInstance.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  });

  console.log('✅ Received response from GROQ');
  const contentJson = completion.choices[0]?.message?.content;
  if (!contentJson) {
    throw new Error('Unexpected response format from GROQ');
  }

  const snippetResponse = JSON.parse(contentJson);

  const snippet = findSnippetRecursively(snippetResponse);

  console.log('🔍 Found snippet:\n', snippet);

  return snippet || '';
}

export async function getCodeSnippetFromCerebras(prompt: string): Promise<string> {
  const cerebrasInstance = getCerebrasInstance();
  const systemPrompt = createSystemPrompt();

  const model = new URL(window.location.href).searchParams.get('model') || 'llama3.1-70b';

  console.log('🤖 Sending request to Cerebras');
  const completion = await cerebrasInstance.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    max_completion_tokens: 1024,
    temperature: 0.7,
    top_p: 1,
  });

  console.log('✅ Received response from Cerebras');
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Unexpected response format from Cerebras');
  }

  // Attempt to parse the content as JSON
  try {
    const snippetResponse = JSON.parse(content);
    const snippet = findSnippetRecursively(snippetResponse);
    if (snippet) {
      return snippet;
    }
  } catch (error) {
    // If parsing fails, assume the content is the snippet itself

    console.log('Failed to parse JSON, using raw content as snippet');
  }

  return cleanCodeSnippet(content);
}

function findSnippetRecursively(obj: any): string | undefined {
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  if ('snippet' in obj && typeof obj.snippet === 'string') {
    return cleanCodeSnippet(obj.snippet);
  }

  for (const key in obj) {
    const result = findSnippetRecursively(obj[key]);
    if (result !== undefined) {
      return cleanCodeSnippet(result);
    }
  }

  return undefined;
}

function cleanCodeSnippet(text: string) {
  console.log('🧹 Cleaning code snippet:', text);

  // Remove code block markers and leading/trailing whitespace
  // return snippet.replace(/^```[\w]*\n?|\n?```$/g, "").trim();

  const codeBlockRegex = /```[\w]*\n?([\s\S]*?)\n?```/g;
  const matches = text.matchAll(codeBlockRegex);
  const snippetCandidates = [...matches].map(match => match[1]);

  if (snippetCandidates.length === 0) {
    return text;
  }

  console.log('🔍 Snippet candidates:', snippetCandidates);

  let result = '';
  for (const candidate of snippetCandidates) {
    if (candidate.length > result.length) {
      result = candidate;
    }
  }
  return result;
}

export async function getCodeSnippetFromMock(prompt: string): Promise<string> {
  console.log('🤖 Generating mock snippet');
  const words = prompt.toLowerCase().split(/\s+/);

  for (const word of words) {
    if (word in mockSnippets) {
      console.log(`✅ Found mock snippet for key: ${word}`);
      return mockSnippets[word];
    }
  }

  console.log('❌ No matching mock snippet found');
  return 'console.log("No matching mock snippet found");';
}

export async function getCodeSnippet(
  prompt: string,
  provider: 'openai' | 'groq' | 'cerebras' | 'mock'
): Promise<string> {
  switch (provider) {
    case 'openai':
      return getCodeSnippetFromOpenAI(prompt);
    case 'groq':
      return getCodeSnippetFromGroq(prompt);
    case 'cerebras':
      return getCodeSnippetFromCerebras(prompt);
    case 'mock':
      return getCodeSnippetFromMock(prompt);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
