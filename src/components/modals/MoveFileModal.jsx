import React, { useState } from "react";

/**
 * folders: array of { id, name } — all folders the file could move into.
 * currentFolderId: the folder the file is currently in (excluded from the list).
 */
export default function MoveFileModal({ open, folders, currentFolderId, onCancel, onSubmit }) {
  const [selectedId, setSelectedId] = useState("root");

  if (!open) return null;

  const options = folders.filter((f) => f.id !== currentFolderId);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(selectedId === "root" ? null : selectedId);
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Move File</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Destination folder
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
            >
              <option value="root">Materials (root)</option>
              {options.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
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
              Move
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}