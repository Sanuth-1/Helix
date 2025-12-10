// Vercel Serverless Function to call Gemini API
// IMPORTANT: You must set the GEMINI_API_KEY environment variable in your Vercel Project Settings

export default async function handler(req, res) {
    // 1. CORS Headers (Optional but good for testing)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // 2. Get the API Key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Server Error: Missing GEMINI_API_KEY environment variable.");
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    // 3. Extract the user's message (which includes context from the frontend)
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message body is required' });
    }

    try {
        // 4. Call Google Gemini 1.5 Flash API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                parts: [{ text: message }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        // 5. Extract the AI's text response safely
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

        // 6. Send back to frontend
        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error('AI Processing Error:', error);
        res.status(500).json({ 
            error: 'Failed to process AI request', 
            details: error.message 
        });
    }
}