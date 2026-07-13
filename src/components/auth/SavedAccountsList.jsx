import React from "react";
import { removeSavedAccount } from "../../context/AuthContext.jsx";

export default function SavedAccountsList({ accounts, onSelect, onAddAccount, onRefresh }) {
  function handleRemove(e, email) {
    e.stopPropagation();
    removeSavedAccount(email);
    onRefresh();
  }

  return (
    <div className="space-y-2 mb-4">
      {accounts.map((acc) => (
        <div
          key={acc.email}
          onClick={() => onSelect(acc.email)}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-purple-500 cursor-pointer transition group relative"
        >
          <img
            src={
              acc.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=random&color=fff`
            }
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            alt={acc.name}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white truncate text-sm">{acc.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{acc.email}</p>
          </div>
          <button
            onClick={(e) => handleRemove(e, acc.email)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Remove account"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
      <div
        onClick={onAddAccount}
        className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition text-gray-500 dark:text-gray-400 hover:text-purple-600"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <i className="fas fa-plus"></i>
        </div>
        <p className="font-medium text-sm">Add another account</p>
      </div>
    </div>
  );
}