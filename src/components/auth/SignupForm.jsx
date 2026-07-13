import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";

export default function SignupForm({ onShowLogin }) {
  const { signup } = useAuth();
  const { showNotification } = useNotification();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://ui-avatars.com/api/?name=New+User&background=f3f4f6&color=6b7280"
  );
  const [loading, setLoading] = useState(false);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ name, department, email, password, isAdmin, adminCode, avatarFile });
      showNotification("Account created!", "success");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">
        Create Account
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => document.getElementById("signup-avatar-input").click()}
          >
            <img
              src={avatarPreview}
              className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-700 object-cover shadow-inner transition-opacity hover:opacity-80"
              alt="avatar preview"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fas fa-camera text-white text-2xl"></i>
            </div>
            <input
              type="file"
              id="signup-avatar-input"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4 -mt-2">
          Tap to upload profile picture
        </p>

        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input
          type="text"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="admin-signup"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="admin-signup" className="text-sm text-gray-600 dark:text-gray-400">
            I am an Admin
          </label>
        </div>
        {isAdmin && (
          <input
            type="text"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Enter Admin Code"
            className="w-full px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 placeholder-red-300 focus:border-red-500 outline-none"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        <button onClick={onShowLogin} className="text-purple-600 font-bold hover:underline">
          Login
        </button>
      </p>
    </div>
  );
}