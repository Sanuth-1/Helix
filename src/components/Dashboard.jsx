import React, { useEffect, useState } from "react";
import { db, firebaseServices } from "../lib/firebase.js";
import { callGemini } from "../lib/gemini.js";
import { useNotification } from "../context/NotificationContext.jsx";
import AIResultModal from "./modals/AIResultModal.jsx";

export default function Dashboard({ currentUser, onNavigate }) {
  const { showNotification } = useNotification();
  const [stats, setStats] = useState({ materials: 0, announcements: 0 });
  const [latestAnnouncements, setLatestAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingText, setBriefingText] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      try {
        const [materialsSnap, announcementsSnap] = await Promise.all([
          firebaseServices.getDocs(firebaseServices.collection(db, "materials")),
          firebaseServices.getDocs(
            firebaseServices.query(
              firebaseServices.collection(db, "announcements"),
              firebaseServices.orderBy("createdAt", "desc")
            )
          ),
        ]);
        if (cancelled) return;
        const announcements = announcementsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setStats({ materials: materialsSnap.size, announcements: announcements.length });
        setLatestAnnouncements(announcements.slice(0, 3));
      } catch (err) {
        showNotification("Could not load dashboard data", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDailyBriefing() {
    setBriefingOpen(true);
    setBriefingLoading(true);
    try {
      const announcementSummary = latestAnnouncements
        .map((a) => `- ${a.title}: ${a.body?.slice(0, 100) || ""}`)
        .join("\n");
      const prompt = `Write a short, friendly daily briefing for a student named ${currentUser.name} in the ${
        currentUser.department || "general"
      } department. Mention there are ${stats.materials} study materials available and summarize these recent announcements:\n${
        announcementSummary || "(no recent announcements)"
      }\n\nKeep it under 120 words, warm and motivating tone.`;
      const text = await callGemini(prompt);
      setBriefingText(text);
    } catch (err) {
      setBriefingText("Could not generate a briefing right now. Please try again shortly.");
    } finally {
      setBriefingLoading(false);
    }
  }

  const statCards = [
    { label: "Study Materials", value: stats.materials, icon: "fa-book", color: "text-blue-500", action: "materials" },
    { label: "Announcements", value: stats.announcements, icon: "fa-bullhorn", color: "text-purple-500", action: "announcements" },
    { label: "Timetable", value: "View", icon: "fa-clock", color: "text-green-500", action: "timetable" },
  ];

  return (
    <div className="fade-in space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {currentUser.name?.split(" ")[0] || "Student"} 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening today.</p>
        </div>
        <button
          onClick={handleDailyBriefing}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-purple-500/20 transition flex items-center gap-2 self-start"
        >
          <span>✨</span> Daily Briefing
        </button>
      </div>

      <button
        onClick={() => onNavigate("profile")}
        className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition"
      >
        <img
          src={
            currentUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "Student")}&background=random&color=fff`
          }
          alt={currentUser.name}
          className="w-14 h-14 rounded-full object-cover border border-gray-100 dark:border-gray-700"
        />
        <div className="min-w-0">
          <p className="font-bold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {currentUser.department || "Student"}
          </p>
        </div>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <button
            key={card.label}
            onClick={() => onNavigate(card.action)}
            className="text-left bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <i className={`fas ${card.icon} ${card.color} text-2xl mb-3`}></i>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? <span className="skeleton inline-block w-10 h-6 rounded"></span> : card.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Announcements</h3>
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-14 rounded-xl"></div>
            <div className="skeleton h-14 rounded-xl"></div>
          </div>
        ) : latestAnnouncements.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {latestAnnouncements.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
              >
                <p className="font-semibold text-gray-900 dark:text-white">{a.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{a.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AIResultModal
        open={briefingOpen}
        title="Your Daily Briefing"
        content={briefingText}
        loading={briefingLoading}
        onClose={() => setBriefingOpen(false)}
      />
    </div>
  );
}