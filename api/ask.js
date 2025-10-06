// api/ask.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = await req.json?.() || req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiResponse.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

    res.status(200).json({ reply: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
}
