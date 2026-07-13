const GEMINI_MODEL = "gemini-3.5-flash";

/**
 * Calls Gemini with a prompt and optional system instruction.
 * Requires VITE_GEMINI_API_KEY to be set at build time.
 */
export async function callGemini(
  prompt,
  systemInstruction = "You are Helix, a helpful AI assistant for students."
) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Set VITE_GEMINI_API_KEY.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    }),
  });

  if (!res.ok) {
    throw new Error("AI request failed. Please try again.");
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("The AI returned an empty response.");
  return text;
}