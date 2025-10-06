// /api/ask.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    // ✅ Use a valid model from your list
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    // 🧠 Extract text safely
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.output ||
      data?.message ||
      "No response text found.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: err.message || "Request failed" });
  }
}
