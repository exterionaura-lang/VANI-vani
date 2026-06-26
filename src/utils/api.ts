export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const customKey = typeof window !== "undefined" ? (localStorage.getItem("vani_custom_gemini_api_key") || "") : "";
  const newInit = { ...init };
  if (customKey) {
    newInit.headers = {
      ...(newInit.headers || {}),
      "x-custom-api-key": customKey,
    };
  }
  return fetch(input, newInit);
};
