import React, { createContext, useCallback, useContext, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null); // { message, type }

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
      {notification && (
        <div
          className={`fixed top-24 right-6 z-[80] px-5 py-3 rounded-xl shadow-2xl font-medium text-sm text-white animate-fade-in-up ${
            notification.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}