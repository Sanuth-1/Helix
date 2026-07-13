import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "fa-home" },
  { id: "materials", label: "Materials", icon: "fa-book" },
  { id: "timetable", label: "Timetable", icon: "fa-clock" },
  { id: "announcements", label: "Alerts", icon: "fa-bullhorn" },
  { id: "profile", label: "My Profile", icon: "fa-user-cog" },
];

export default function Navbar({ activeSection, onNavigate }) {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const avatarSrc =
    currentUser?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      currentUser?.name || "Student"
    )}&background=random&color=fff`;

  async function handleSwitchAccount() {
    await logout();
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-helix-700/90 backdrop-blur-md text-white shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onNavigate("dashboard")}
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition">
              <i className="fas fa-dna text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold tracking-wide">Helix</h1>
          </div>

          <div className="flex items-center space-x-3">
            <img
              src={avatarSrc}
              alt="avatar"
              onClick={() => onNavigate("profile")}
              className="hidden md:block w-9 h-9 rounded-full object-cover cursor-pointer border border-white/20"
            />
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition"
              title="Toggle Theme"
            >
              <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/10"
              >
                <i className="fas fa-bars"></i>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 z-50 border border-gray-100 dark:border-gray-700">
                  <div className="px-4 py-3 mb-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {currentUser?.department || "Student"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 font-medium ${
                          activeSection === item.id
                            ? "bg-purple-50 dark:bg-gray-700/50 text-purple-600"
                            : "text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700/50 hover:text-purple-600"
                        }`}
                      >
                        <i className={`fas ${item.icon} w-5`}></i> {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
                    <button
                      onClick={handleSwitchAccount}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700/50 hover:text-purple-600 transition flex items-center gap-3 font-medium"
                    >
                      <i className="fas fa-users-cog w-5"></i> Switch Account
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-3 font-medium"
                    >
                      <i className="fas fa-sign-out-alt w-5"></i> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}