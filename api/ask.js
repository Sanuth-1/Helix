// /api/ask.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await r.json();

    // 👇 just send Gemini's raw reply to the browser
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
