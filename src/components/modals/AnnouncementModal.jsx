import React, { useEffect, useState } from "react";
import { callGemini } from "../../lib/gemini.js";

/**
 * mode: "create" | "edit"
 */
export default function AnnouncementModal({ open, mode = "create", initial, onCancel, onSubmit }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [draftTopic, setDraftTopic] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setBody(initial?.body || "");
      setDraftTopic("");
    }
  }, [open, initial]);

  if (!open) return null;

  async function handleDraft() {
    if (!draftTopic.trim()) return;
    setDrafting(true);
    try {
      const text = await callGemini(
        `Draft a short, clear announcement for students about: ${draftTopic}. Keep it under 80 words, professional but friendly tone. Respond with only the announcement body text, no title.`
      );
      setBody(text);
      if (!title.trim()) setTitle(draftTopic);
    } catch {
      // silent fail — the admin can just type manually
    } finally {
      setDrafting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), body: body.trim() });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {mode === "edit" ? "Edit Announcement" : "New Announcement"}
        </h3>

        <div className="mb-4 p-3 rounded-xl bg-purple-50 dark:bg-gray-700/50 border border-purple-100 dark:border-gray-600">
          <label className="block text-xs font-bold mb-1.5 text-purple-700 dark:text-purple-300">
            ✨ Draft with AI (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={draftTopic}
              onChange={(e) => setDraftTopic(e.target.value)}
              placeholder="e.g. exam schedule change"
              className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
            <button
              type="button"
              onClick={handleDraft}
              disabled={drafting || !draftTopic.trim()}
              className="px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {drafting ? "..." : "Draft"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Body</label>
            <textarea
              required
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}