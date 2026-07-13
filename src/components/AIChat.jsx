import React, { useEffect, useRef, useState } from "react";
import { callGemini } from "../lib/gemini.js";

export default function AIChat({ currentUser }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hi ${currentUser.name?.split(" ")[0] || "there"}! Ask me anything about your studies.` },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const historyText = nextMessages
        .slice(-8)
        .map((m) => `${m.role === "user" ? "Student" : "Helix"}: ${m.text}`)
        .join("\n");
      const reply = await callGemini(
        `${historyText}\nHelix:`,
        "You are Helix, a friendly and concise AI study assistant embedded in a student portal. Keep answers short and helpful."
      );
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-2xl shadow-purple-500/30 flex items-center justify-center transition"
        title="Ask Helix AI"
      >
        <i className={`fas ${open ? "fa-times" : "fa-robot"} text-xl`}></i>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm h-[28rem] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="bg-helix-700 text-white px-4 py-3 flex items-center gap-2">
            <i className="fas fa-robot"></i>
            <span className="font-bold">Helix AI</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-3.5 py-2 rounded-2xl rounded-bl-sm text-sm text-gray-400">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center disabled:opacity-50 transition flex-shrink-0"
            >
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}