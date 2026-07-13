import React, { useEffect, useState } from "react";

/**
 * mode: "create" | "rename"
 */
export default function FolderModal({ open, mode = "create", initialName = "", onCancel, onSubmit }) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, open]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {mode === "rename" ? "Rename Folder" : "Create New Folder"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Folder Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., BCH 201"
              className="w-full px-4 py-2 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
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
              className="bg-gray-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              {mode === "rename" ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}