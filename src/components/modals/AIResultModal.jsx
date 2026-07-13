import React from "react";

export default function AIResultModal({ open, title, content, loading, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-2xl sm:w-full sm:max-w-2xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-purple-500">✨</span> {title || "AI Result"}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
              {loading ? "Thinking..." : content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}