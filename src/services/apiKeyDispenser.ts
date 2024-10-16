type ApiKeyDispenser = {
  getNextApiKey: () => string;
  resetApiKeys: () => void;
};

export const createApiKeyDispenser = (
  localStorageKey: string,
  promptMessage: string
): ApiKeyDispenser => {
  let apiKeys: string[] = [];
  let currentKeyIndex = 0;

  const initializeApiKeys = (): void => {
    const storedKeys = localStorage.getItem(localStorageKey);
    if (storedKeys) {
      apiKeys = storedKeys.split(",");
    } else {
      const userInput = prompt(promptMessage);
      if (!userInput) throw new Error("API keys are required");
      apiKeys = userInput.split(",").map(key => key.trim());
      localStorage.setItem(localStorageKey, apiKeys.join(","));
    }
    currentKeyIndex = Math.floor(Math.random() * apiKeys.length);
    console.log(`🔑 API keys initialized for ${localStorageKey}`);
  };

  const getNextApiKey = (): string => {
    if (apiKeys.length === 0) {
      initializeApiKeys();
    }
    const apiKey = apiKeys[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    return apiKey;
  };

  const resetApiKeys = (): void => {
    localStorage.removeItem(localStorageKey);
    apiKeys = [];
    currentKeyIndex = 0;
    console.log(`🔄 API keys reset for ${localStorageKey}`);
  };

  return { getNextApiKey, resetApiKeys };
};
