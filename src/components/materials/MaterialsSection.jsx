import React, { useEffect, useMemo, useState } from "react";
import { db, firebaseServices } from "../../lib/firebase.js";
import { supabase } from "../../lib/supabase.js";
import { callGemini } from "../../lib/gemini.js";
import { useNotification } from "../../context/NotificationContext.jsx";
import FolderBreadcrumb from "./FolderBreadcrumb.jsx";
import MaterialsList from "./MaterialsList.jsx";
import FolderModal from "../modals/FolderModal.jsx";
import UploadModal from "../modals/UploadModal.jsx";
import MoveFileModal from "../modals/MoveFileModal.jsx";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal.jsx";
import AIResultModal from "../modals/AIResultModal.jsx";

export default function MaterialsSection({ currentUser }) {
  const { showNotification } = useNotification();
  const isAdmin = currentUser.role === "admin";

  const [allFolders, setAllFolders] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState([]); // [{id, name}]
  const [search, setSearch] = useState("");

  const [folderModal, setFolderModal] = useState({ open: false, mode: "create", folder: null });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [moveFile, setMoveFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'folder'|'file', item }

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState("");

  const currentFolderId = path.length > 0 ? path[path.length - 1].id : null;

  async function loadAll() {
    setLoading(true);
    try {
      const [foldersSnap, filesSnap] = await Promise.all([
        firebaseServices.getDocs(firebaseServices.collection(db, "folders")),
        firebaseServices.getDocs(
          firebaseServices.query(
            firebaseServices.collection(db, "materials"),
            firebaseServices.orderBy("createdAt", "desc")
          )
        ),
      ]);
      setAllFolders(foldersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setAllFiles(filesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      showNotification("Could not load materials", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const visibleFolders = useMemo(
    () => allFolders.filter((f) => (f.parentId || null) === currentFolderId),
    [allFolders, currentFolderId]
  );
  const visibleFiles = useMemo(() => {
    const inFolder = allFiles.filter((f) => (f.folderId || null) === currentFolderId);
    if (!search.trim()) return inFolder;
    return allFiles.filter((f) => f.title.toLowerCase().includes(search.toLowerCase()));
  }, [allFiles, currentFolderId, search]);

  function handleOpenFolder(folder) {
    setSearch("");
    setPath([...path, { id: folder.id, name: folder.name }]);
  }

  function handleBreadcrumbNav(idx) {
    setSearch("");
    setPath(idx === -1 ? [] : path.slice(0, idx + 1));
  }

  async function handleCreateFolder(name) {
    try {
      await firebaseServices.addDoc(firebaseServices.collection(db, "folders"), {
        name,
        parentId: currentFolderId,
        createdAt: new Date(),
      });
      showNotification("Folder created", "success");
      setFolderModal({ open: false, mode: "create", folder: null });
      loadAll();
    } catch {
      showNotification("Could not create folder", "error");
    }
  }

  async function handleRenameFolder(name) {
    try {
      await firebaseServices.updateDoc(
        firebaseServices.doc(db, "folders", folderModal.folder.id),
        { name }
      );
      showNotification("Folder renamed", "success");
      setFolderModal({ open: false, mode: "create", folder: null });
      loadAll();
    } catch {
      showNotification("Could not rename folder", "error");
    }
  }

  async function handleUpload({ title, file }) {
    try {
      const path_ = `materials/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("materials").upload(path_, file);
      if (error) throw error;
      const { data: pub } = supabase.storage.from("materials").getPublicUrl(path_);
      await firebaseServices.addDoc(firebaseServices.collection(db, "materials"), {
        title,
        url: pub.publicUrl,
        storagePath: path_,
        folderId: currentFolderId,
        createdAt: new Date(),
        uploadedBy: currentUser.uid,
      });
      showNotification("Material uploaded", "success");
      setUploadOpen(false);
      loadAll();
    } catch {
      showNotification("Upload failed", "error");
    }
  }

  async function handleMoveFile(destFolderId) {
    try {
      await firebaseServices.updateDoc(firebaseServices.doc(db, "materials", moveFile.id), {
        folderId: destFolderId,
      });
      showNotification("File moved", "success");
      setMoveFile(null);
      loadAll();
    } catch {
      showNotification("Could not move file", "error");
    }
  }

  async function handleConfirmDelete() {
    try {
      if (deleteTarget.type === "folder") {
        await firebaseServices.deleteDoc(firebaseServices.doc(db, "folders", deleteTarget.item.id));
        showNotification("Folder deleted", "success");
      } else {
        const file = deleteTarget.item;
        if (file.storagePath) {
          await supabase.storage.from("materials").remove([file.storagePath]);
        }
        await firebaseServices.deleteDoc(firebaseServices.doc(db, "materials", file.id));
        showNotification("File deleted", "success");
      }
      setDeleteTarget(null);
      loadAll();
    } catch {
      showNotification("Delete failed", "error");
    }
  }

  async function handleAnalyzeTopics() {
    setAiOpen(true);
    setAiLoading(true);
    try {
      const titles = visibleFiles.map((f) => f.title).join(", ") || "no materials in this folder";
      const prompt = `Based on these study material titles: ${titles}\n\nSummarize the likely topics covered and suggest 3 related concepts a student should also review.`;
      const text = await callGemini(prompt);
      setAiContent(text);
    } catch {
      setAiContent("Could not analyze materials right now.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Materials</h2>
          <FolderBreadcrumb path={path} onNavigate={handleBreadcrumbNav} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleAnalyzeTopics}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
          >
            ✨ Analyze Topics
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setFolderModal({ open: true, mode: "create", folder: null })}
                className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
              >
                <i className="fas fa-folder-plus mr-1"></i> New Folder
              </button>
              <button
                onClick={() => setUploadOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
              >
                <i className="fas fa-upload mr-1"></i> Upload
              </button>
            </>
          )}
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search all materials by title..."
        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        {loading ? (
          <div className="space-y-3 p-2">
            <div className="skeleton h-12 rounded-xl"></div>
            <div className="skeleton h-12 rounded-xl"></div>
            <div className="skeleton h-12 rounded-xl"></div>
          </div>
        ) : (
          <MaterialsList
            folders={search.trim() ? [] : visibleFolders}
            files={visibleFiles}
            isAdmin={isAdmin}
            onOpenFolder={handleOpenFolder}
            onRenameFolder={(folder) => setFolderModal({ open: true, mode: "rename", folder })}
            onDeleteFolder={(folder) => setDeleteTarget({ type: "folder", item: folder })}
            onDeleteFile={(file) => setDeleteTarget({ type: "file", item: file })}
            onMoveFile={(file) => setMoveFile(file)}
          />
        )}
      </div>

      <FolderModal
        open={folderModal.open}
        mode={folderModal.mode}
        initialName={folderModal.folder?.name || ""}
        onCancel={() => setFolderModal({ open: false, mode: "create", folder: null })}
        onSubmit={folderModal.mode === "rename" ? handleRenameFolder : handleCreateFolder}
      />
      <UploadModal open={uploadOpen} onCancel={() => setUploadOpen(false)} onSubmit={handleUpload} />
      <MoveFileModal
        open={!!moveFile}
        folders={allFolders}
        currentFolderId={moveFile?.folderId}
        onCancel={() => setMoveFile(null)}
        onSubmit={handleMoveFile}
      />
      <ConfirmDeleteModal
        open={!!deleteTarget}
        warningText={
          deleteTarget?.type === "folder"
            ? "Deleting a folder does not delete its files — move them out first."
            : "This file will be permanently deleted."
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
      <AIResultModal
        open={aiOpen}
        title="Topic Analysis"
        content={aiContent}
        loading={aiLoading}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
}