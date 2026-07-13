import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import Navbar from "./components/Navbar.jsx";
import AuthScreen from "./components/auth/AuthScreen.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Timetable from "./components/Timetable.jsx";
import MaterialsSection from "./components/materials/MaterialsSection.jsx";
import Announcements from "./components/Announcements.jsx";
import Profile from "./components/Profile.jsx";
import AIChat from "./components/AIChat.jsx";

function MainApp() {
  const { currentUser, authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  if (authLoading) return <LoadingScreen />;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <AuthScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "dashboard" && (
          <Dashboard currentUser={currentUser} onNavigate={setActiveSection} />
        )}
        {activeSection === "timetable" && <Timetable currentUser={currentUser} />}
        {activeSection === "materials" && <MaterialsSection currentUser={currentUser} />}
        {activeSection === "announcements" && <Announcements currentUser={currentUser} />}
        {activeSection === "profile" && <Profile currentUser={currentUser} />}
      </main>
      <AIChat currentUser={currentUser} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}