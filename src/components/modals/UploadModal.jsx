import React, { useState } from "react";

export default function UploadModal({ open, onCancel, onSubmit }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      await onSubmit({ title, file });
      setTitle("");
      setFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload Material</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">File</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition"
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
              disabled={uploading}
              className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2 disabled:opacity-60"
            >
              <span>{uploading ? "Uploading..." : "Upload"}</span>
              {uploading && <i className="fas fa-spinner fa-spin"></i>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}