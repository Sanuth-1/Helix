import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";

export default function LoginForm({ prefillEmail, onShowSignup, onShowForgot }) {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showNotification("Login successful", "success");
    } catch (err) {
      showNotification("Login failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome Back</h3>
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-helix-600 hover:bg-helix-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <button onClick={onShowSignup} className="text-purple-600 font-bold hover:underline">
            Sign up
          </button>
        </p>
        <button onClick={onShowForgot} className="text-gray-400 hover:text-gray-600 transition">
          Forgot Password?
        </button>
      </div>
    </div>
  );
}