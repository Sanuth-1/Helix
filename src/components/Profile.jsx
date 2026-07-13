import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

export default function Profile({ currentUser }) {
  const { updateProfile, updateAvatar } = useAuth();
  const { showNotification } = useNotification();

  const [name, setName] = useState(currentUser.name || "");
  const [department, setDepartment] = useState(currentUser.department || "");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const avatarSrc =
    currentUser.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "Student")}&background=random&color=fff`;

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await updateAvatar(file);
      showNotification("Profile photo updated", "success");
    } catch {
      showNotification("Could not update photo", "error");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, department });
      showNotification("Profile updated", "success");
    } catch {
      showNotification("Could not update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in max-w-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative group cursor-pointer"
            onClick={() => document.getElementById("profile-avatar-input").click()}
          >
            <img
              src={avatarSrc}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow"
              alt="avatar"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className={`fas ${uploadingAvatar ? "fa-spinner fa-spin" : "fa-camera"} text-white text-2xl`}></i>
            </div>
            <input
              type="file"
              id="profile-avatar-input"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Tap photo to change</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Role</label>
            <input
              type="text"
              disabled
              value={currentUser.role === "admin" ? "Admin" : "Student"}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}