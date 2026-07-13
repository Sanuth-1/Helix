import React from "react";

/**
 * path: array of { id, name } representing the folder trail, root excluded.
 */
export default function FolderBreadcrumb({ path, onNavigate }) {
  return (
    <div className="flex items-center flex-wrap gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
      <button
        onClick={() => onNavigate(-1)}
        className="hover:text-purple-600 transition flex items-center gap-1.5"
      >
        <i className="fas fa-home"></i> Materials
      </button>
      {path.map((folder, idx) => (
        <React.Fragment key={folder.id}>
          <i className="fas fa-chevron-right text-xs text-gray-300 dark:text-gray-600"></i>
          <button
            onClick={() => onNavigate(idx)}
            className={`hover:text-purple-600 transition ${
              idx === path.length - 1 ? "text-gray-900 dark:text-white font-semibold" : ""
            }`}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}