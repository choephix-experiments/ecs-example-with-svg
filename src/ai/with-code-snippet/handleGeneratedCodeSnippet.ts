import { createEasyBreezyContext } from "../../misc/createEasyBreezyContext";

export async function handleGeneratedCodeSnippet(snippet: string) {
  console.log("📜 Handling generated code snippet");

  try {
    const easyContext = createEasyBreezyContext();
    
    // Create a new function with all easyContext properties in its scope
    const snippetFunction = new Function(
      ...Object.keys(easyContext),
      `
        return (async () => {
          ${snippet}
        })();
      `
    );

    // Execute the snippet function with easyContext values as arguments
    const result = await snippetFunction(...Object.values(easyContext));
    
    console.log("✅ Snippet executed successfully");
    console.log("🔍 Result:", result);

    return result;
  } catch (error) {
    console.error("❌ Error executing snippet:", error);
    throw error;
  }
}
