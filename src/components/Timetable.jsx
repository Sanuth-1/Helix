import React, { useEffect, useRef, useState } from "react";
import { db, firebaseServices } from "../lib/firebase.js";
import { callGemini } from "../lib/gemini.js";
import { useNotification } from "../context/NotificationContext.jsx";
import AIResultModal from "./modals/AIResultModal.jsx";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMETABLE_DOC = ["settings", "timetable"];

export default function Timetable({ currentUser }) {
  const { showNotification } = useNotification();
  const isAdmin = currentUser.role === "admin";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiContent, setAiContent] = useState("");

  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const snap = await firebaseServices.getDoc(
          firebaseServices.doc(db, TIMETABLE_DOC[0], TIMETABLE_DOC[1])
        );
        if (!cancelled) {
          setRows(snap.exists() ? snap.data().rows || [] : []);
        }
      } catch {
        showNotification("Could not load timetable", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function scheduleSave(nextRows) {
    setRows(nextRows);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await firebaseServices.setDoc(
          firebaseServices.doc(db, TIMETABLE_DOC[0], TIMETABLE_DOC[1]),
          { rows: nextRows }
        );
      } catch {
        showNotification("Failed to save timetable changes", "error");
      } finally {
        setSaving(false);
      }
    }, 700);
  }

  function updateCell(rowId, field, value) {
    const next = rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r));
    scheduleSave(next);
  }

  function addRow() {
    const next = [...rows, { id: `row_${Date.now()}`, time: "New Slot", Mon: "", Tue: "", Wed: "", Thu: "", Fri: "" }];
    scheduleSave(next);
  }

  function confirmDeleteRow() {
    const next = rows.filter((r) => r.id !== deleteRowId);
    scheduleSave(next);
    setDeleteRowId(null);
  }

  async function generateStudyPlan() {
    setAiOpen(true);
    setAiTitle("AI Study Plan");
    setAiLoading(true);
    try {
      const scheduleText = rows
        .map((r) => `${r.time}: ${DAYS.map((d) => `${d}=${r[d] || "free"}`).join(", ")}`)
        .join("\n");
      const prompt = `Based on this weekly class schedule, suggest a balanced weekly study plan that fits around the classes, including suggested study blocks and short breaks:\n\n${scheduleText}\n\nRespond with a concise day-by-day plan.`;
      const text = await callGemini(prompt);
      setAiContent(text);
    } catch {
      setAiContent("Could not generate a study plan right now.");
    } finally {
      setAiLoading(false);
    }
  }

  async function generateQuiz() {
    setAiOpen(true);
    setAiTitle("Quick Quiz");
    setAiLoading(true);
    try {
      const subjects = [...new Set(rows.flatMap((r) => DAYS.map((d) => r[d]).filter(Boolean)))];
      const prompt = `Generate a short 5-question multiple choice quiz covering general concepts from these subjects: ${
        subjects.join(", ") || "general studies"
      }. Include the correct answer after each question.`;
      const text = await callGemini(prompt);
      setAiContent(text);
    } catch {
      setAiContent("Could not generate a quiz right now.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Timetable</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {saving ? "Saving..." : "Weekly class schedule"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={generateStudyPlan}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
          >
            ✨ Study Plan
          </button>
          <button
            onClick={generateQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
          >
            ✨ Quick Quiz
          </button>
          {isAdmin && (
            <button
              onClick={addRow}
              className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
            >
              <i className="fas fa-plus mr-1"></i> Add Row
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
        {loading ? (
          <div className="p-6 space-y-3">
            <div className="skeleton h-10 rounded-xl"></div>
            <div className="skeleton h-10 rounded-xl"></div>
            <div className="skeleton h-10 rounded-xl"></div>
          </div>
        ) : (
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                <th className="p-3 text-left font-semibold w-32">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="p-3 text-left font-semibold">
                    {d}
                  </th>
                ))}
                {isAdmin && <th className="p-3 w-12"></th>}
              </tr>
            </thead>
            <tbody id="timetable-body">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="p-6 text-center text-gray-400">
                    No timetable entries yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="p-2">
                    {isAdmin ? (
                      <input
                        value={row.time}
                        onChange={(e) => updateCell(row.id, "time", e.target.value)}
                        className="w-full bg-transparent font-semibold text-gray-800 dark:text-gray-200 outline-none rounded px-1"
                      />
                    ) : (
                      <span className="font-semibold text-gray-800 dark:text-gray-200 px-1">{row.time}</span>
                    )}
                  </td>
                  {DAYS.map((d) => (
                    <td key={d} className="p-2">
                      {isAdmin ? (
                        <textarea
                          rows={1}
                          value={row[d] || ""}
                          onChange={(e) => updateCell(row.id, d, e.target.value)}
                          className="w-full bg-transparent text-gray-700 dark:text-gray-300 outline-none rounded px-1 focus:bg-purple-50 dark:focus:bg-gray-700"
                        />
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300 px-1">{row[d] || "—"}</span>
                      )}
                    </td>
                  ))}
                  {isAdmin && (
                    <td className="p-2 text-center">
                      <button
                        onClick={() => setDeleteRowId(row.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AIResultModal
        open={aiOpen}
        title={aiTitle}
        content={aiContent}
        loading={aiLoading}
        onClose={() => setAiOpen(false)}
      />
      <ConfirmDeleteModal
        open={!!deleteRowId}
        warningText="This will remove the selected timetable row."
        onCancel={() => setDeleteRowId(null)}
        onConfirm={confirmDeleteRow}
      />
    </div>
  );
}