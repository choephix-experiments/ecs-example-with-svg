import { createEasyBreezyContext } from "../../misc/createEasyBreezyContext";

export async function handleGeneratedCodeSnippet(snippet: string) {
  console.log("📜 Handling generated code snippet");

  try {
    const easyContext = createEasyBreezyContext();

    // Wrap the snippet in an async IIFE and pass the context as an argument
    const wrappedSnippet = `
      (async (context) => {
        var { ${Object.keys(easyContext).join(', ')} } = context;
        ${snippet}
      })(this)
    `;

    // Create a new function with the wrapped snippet
    const snippetFunction = new Function(wrappedSnippet);

    // Execute the snippet function with easyContext as its `this` context
    const result = await snippetFunction.call(easyContext);

    console.log("✅ Snippet executed successfully");
    console.log("🔍 Result:", result);

    return result;
  } catch (error) {
    console.error("❌ Error executing snippet:", error);
    throw error;
  }
}

export function runSnippetWithEasyBreezyContext(
  $this: any,
  snippet: string,
  params: { [key: string]: any }
) {
  const context = createEasyBreezyContext();
  return runSnippetWithContext($this, snippet, context, params);
}

export function runSnippetWithContext(
  $this: any,
  snippet: string,
  context: any,
  params: { [key: string]: any }
) {
  const wrappedSnippet = `
    var { ${Object.keys(context).join(", ")} } = context;
    ${snippet}
  `;

  const snippetFunction = new Function(
    "context",
    ...Object.keys(params),
    wrappedSnippet
  );

  return snippetFunction.call($this, context, ...Object.values(params));
}
