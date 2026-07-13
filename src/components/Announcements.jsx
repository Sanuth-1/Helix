import React, { useEffect, useState } from "react";
import { db, firebaseServices } from "../lib/firebase.js";
import { useNotification } from "../context/NotificationContext.jsx";
import AnnouncementModal from "./modals/AnnouncementModal.jsx";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal.jsx";

export default function Announcements({ currentUser }) {
  const { showNotification } = useNotification();
  const isAdmin = currentUser.role === "admin";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "create", item: null });
  const [deleteItem, setDeleteItem] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const snap = await firebaseServices.getDocs(
        firebaseServices.query(
          firebaseServices.collection(db, "announcements"),
          firebaseServices.orderBy("createdAt", "desc")
        )
      );
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      showNotification("Could not load announcements", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit({ title, body }) {
    try {
      if (modal.mode === "edit") {
        await firebaseServices.updateDoc(
          firebaseServices.doc(db, "announcements", modal.item.id),
          { title, body }
        );
        showNotification("Announcement updated", "success");
      } else {
        await firebaseServices.addDoc(firebaseServices.collection(db, "announcements"), {
          title,
          body,
          createdAt: new Date(),
          postedBy: currentUser.name,
        });
        showNotification("Announcement posted", "success");
      }
      setModal({ open: false, mode: "create", item: null });
      load();
    } catch {
      showNotification("Could not save announcement", "error");
    }
  }

  async function handleDelete() {
    try {
      await firebaseServices.deleteDoc(firebaseServices.doc(db, "announcements", deleteItem.id));
      showNotification("Announcement deleted", "success");
      setDeleteItem(null);
      load();
    } catch {
      showNotification("Delete failed", "error");
    }
  }

  return (
    <div className="fade-in space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h2>
        {isAdmin && (
          <button
            onClick={() => setModal({ open: true, mode: "create", item: null })}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
          >
            <i className="fas fa-plus mr-1"></i> New
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-24 rounded-2xl"></div>
          <div className="skeleton h-24 rounded-2xl"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <i className="fas fa-bullhorn text-4xl mb-3"></i>
          <p>No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{a.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{a.body}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                    {a.postedBy ? `Posted by ${a.postedBy}` : ""}
                    {a.createdAt?.toDate ? ` · ${a.createdAt.toDate().toLocaleDateString()}` : ""}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setModal({ open: true, mode: "edit", item: a })}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50 dark:hover:bg-gray-700"
                    >
                      <i className="fas fa-pen text-sm"></i>
                    </button>
                    <button
                      onClick={() => setDeleteItem(a)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementModal
        open={modal.open}
        mode={modal.mode}
        initial={modal.item}
        onCancel={() => setModal({ open: false, mode: "create", item: null })}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteModal
        open={!!deleteItem}
        warningText="This announcement will be permanently removed."
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}