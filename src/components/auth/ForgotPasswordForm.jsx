import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";

export default function ForgotPasswordForm({ onShowLogin }) {
  const { forgotPassword } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      showNotification(`Reset email sent to ${email}`, "success");
      setTimeout(onShowLogin, 2000);
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Reset Password</h3>
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
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