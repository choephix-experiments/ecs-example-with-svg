import { magicApi } from "./magicApi";

export async function handleGeneratedCodeSnippet(snippet: string) {
  console.log("📜 Handling generated code snippet");

  try {
    // Create a new function with magicApi in its scope
    const snippetFunction = new Function(
      "magicApi",
      `
        return (async () => {
          ${snippet}
        })();
      `
    );

    // Execute the snippet function with magicApi as an argument
    const result = await snippetFunction(magicApi);
    
    console.log("✅ Snippet executed successfully");
    console.log("🔍 Result:", result);

    return result;
  } catch (error) {
    console.error("❌ Error executing snippet:", error);
    throw error;
  }
}
