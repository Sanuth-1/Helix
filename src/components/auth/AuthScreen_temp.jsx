import React, { useState } from "react";
import { getSavedAccounts } from "../../context/AuthContext.jsx";
import SavedAccountsList from "./SavedAccountsList.jsx";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import ForgotPasswordForm from "./ForgotPasswordForm.jsx";

const VIEWS = { ACCOUNTS: "accounts", LOGIN: "login", SIGNUP: "signup", FORGOT: "forgot" };

export default function AuthScreen() {
  const [accounts, setAccounts] = useState(getSavedAccounts());
  const [prefillEmail, setPrefillEmail] = useState("");
  const [view, setView] = useState(accounts.length > 0 ? VIEWS.ACCOUNTS : VIEWS.LOGIN);

  function refreshAccounts() {
    setAccounts(getSavedAccounts());
  }

  function selectAccount(email) {
    setPrefillEmail(email);
    setView(VIEWS.LOGIN);
  }

  return (
    <div className="fade-in min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex max-w-5xl w-full border border-gray-100 dark:border-gray-700">
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-helix-600 to-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <i className="fas fa-dna text-4xl"></i>
            </div>
            <h2 className="text-4xl font-extrabold mb-4">Helix Portal</h2>
            <p className="text-purple-100 text-lg leading-relaxed">Your centralized academic hub.</p>
          </div>
          <div className="text-sm opacity-60">© 2026 Sanuth Inc.</div>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-16 bg-white dark:bg-gray-800 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {view === VIEWS.ACCOUNTS && (
              <>
                <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  Choose Account
                </h3>
                <SavedAccountsList
                  accounts={accounts}
                  onSelect={selectAccount}
                  onAddAccount={() => setView(VIEWS.LOGIN)}
                  onRefresh={refreshAccounts}
                />
              </>
            )}
            {view === VIEWS.LOGIN && (
              <LoginForm
                prefillEmail={prefillEmail}
                onShowSignup={() => setView(VIEWS.SIGNUP)}
                onShowForgot={() => setView(VIEWS.FORGOT)}
              />
            )}
            {view === VIEWS.SIGNUP && <SignupForm onShowLogin={() => setView(VIEWS.LOGIN)} />}
            {view === VIEWS.FORGOT && (
              <ForgotPasswordForm onShowLogin={() => setView(VIEWS.LOGIN)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}