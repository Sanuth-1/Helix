import React from "react";

export default function ConfirmDeleteModal({ open, warningText, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-2xl sm:w-full sm:max-w-md border border-gray-100 dark:border-gray-700 p-6">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Item?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {warningText || "This action is permanent."}
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}