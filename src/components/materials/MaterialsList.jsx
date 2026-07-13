import React from "react";

const FILE_ICONS = {
  pdf: "fa-file-pdf text-red-500",
  doc: "fa-file-word text-blue-500",
  docx: "fa-file-word text-blue-500",
  ppt: "fa-file-powerpoint text-orange-500",
  pptx: "fa-file-powerpoint text-orange-500",
  xls: "fa-file-excel text-green-600",
  xlsx: "fa-file-excel text-green-600",
  jpg: "fa-file-image text-purple-500",
  jpeg: "fa-file-image text-purple-500",
  png: "fa-file-image text-purple-500",
};

function fileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  return FILE_ICONS[ext] || "fa-file text-gray-400";
}

export default function MaterialsList({
  folders,
  files,
  isAdmin,
  onOpenFolder,
  onRenameFolder,
  onDeleteFolder,
  onDeleteFile,
  onMoveFile,
}) {
  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <i className="fas fa-folder-open text-4xl mb-3"></i>
        <p>This folder is empty.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="flex items-center gap-4 py-4 px-1 group hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition"
        >
          <button
            onClick={() => onOpenFolder(folder)}
            className="flex items-center gap-4 flex-1 min-w-0 text-left"
          >
            <i className="fas fa-folder text-2xl text-yellow-500 flex-shrink-0"></i>
            <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">
              {folder.name}
            </span>
          </button>
          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => onRenameFolder(folder)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50 dark:hover:bg-gray-700"
                title="Rename"
              >
                <i className="fas fa-pen text-sm"></i>
              </button>
              <button
                onClick={() => onDeleteFolder(folder)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                title="Delete"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          )}
        </div>
      ))}

      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-4 py-4 px-1 group hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition"
        >
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 flex-1 min-w-0"
          >
            <i className={`fas ${fileIcon(file.title)} text-2xl flex-shrink-0`}></i>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{file.title}</p>
              {file.createdAt?.toDate && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {file.createdAt.toDate().toLocaleDateString()}
                </p>
              )}
            </div>
          </a>
          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => onMoveFile(file)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                title="Move"
              >
                <i className="fas fa-arrows-alt text-sm"></i>
              </button>
              <button
                onClick={() => onDeleteFile(file)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                title="Delete"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}