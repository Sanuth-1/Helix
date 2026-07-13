import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, firebaseServices } from "../lib/firebase.js";

const AuthContext = createContext(null);

const SAVED_ACCOUNTS_KEY = "helix_saved_accounts";

export function getSavedAccounts() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAccountLocally(user) {
  let accounts = getSavedAccounts();
  accounts = accounts.filter((a) => a.email !== user.email);
  accounts.unshift({
    uid: user.uid,
    name: user.name || "User",
    email: user.email,
    photoURL: user.photoURL,
    role: user.role,
    lastActive: Date.now(),
  });
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function removeSavedAccount(email) {
  const accounts = getSavedAccounts().filter((a) => a.email !== email);
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseServices.onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await firebaseServices.getDoc(
          firebaseServices.doc(db, "users", user.uid)
        );
        const profile = userDoc.exists()
          ? { uid: user.uid, email: user.email, ...userDoc.data() }
          : { uid: user.uid, email: user.email, name: "Student", role: "student" };
        saveAccountLocally(profile);
        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function login(email, password) {
    await firebaseServices.signInWithEmailAndPassword(auth, email, password);
  }

  async function signup({ name, department, email, password, isAdmin, adminCode, avatarFile }) {
    if (isAdmin && adminCode !== "HELIX28") {
      throw new Error("Invalid Admin Code");
    }

    const cred = await firebaseServices.createUserWithEmailAndPassword(auth, email, password);

    let photoURL = null;
    if (avatarFile) {
      const { supabase } = await import("../lib/supabase.js");
      const path = `avatars/${cred.user.uid}_${Date.now()}_${avatarFile.name}`;
      const { error } = await supabase.storage.from("materials").upload(path, avatarFile);
      if (!error) {
        const { data: pub } = supabase.storage.from("materials").getPublicUrl(path);
        photoURL = pub.publicUrl;
      }
    }

    const userData = {
      name,
      email,
      department,
      role: isAdmin ? "admin" : "student",
      createdAt: new Date(),
      photoURL,
    };
    await firebaseServices.setDoc(firebaseServices.doc(db, "users", cred.user.uid), userData);
    saveAccountLocally({ ...userData, uid: cred.user.uid });
  }

  async function forgotPassword(email) {
    await firebaseServices.sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    await firebaseServices.signOut(auth);
  }

  async function updateProfile({ name, department }) {
    await firebaseServices.updateDoc(firebaseServices.doc(db, "users", currentUser.uid), {
      name,
      department,
    });
    setCurrentUser((prev) => ({ ...prev, name, department }));
  }

  async function updateAvatar(file) {
    const { supabase } = await import("../lib/supabase.js");
    const path = `avatars/${currentUser.uid}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("materials").upload(path, file);
    if (error) throw error;
    const { data: pub } = supabase.storage.from("materials").getPublicUrl(path);
    await firebaseServices.updateDoc(firebaseServices.doc(db, "users", currentUser.uid), {
      photoURL: pub.publicUrl,
    });
    setCurrentUser((prev) => ({ ...prev, photoURL: pub.publicUrl }));
    return pub.publicUrl;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        login,
        signup,
        forgotPassword,
        logout,
        updateProfile,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}