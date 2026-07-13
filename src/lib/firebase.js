import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// These are Firebase's public client config values — safe to expose in
// frontend code. Actual access is enforced by Firestore/Storage security
// rules on the Firebase project itself, not by keeping this config secret.
const firebaseConfig = {
  apiKey: "AIzaSyB0--bDqGPckl7pENJLMN_95fDNAaXR4zs",
  authDomain: "helixfinale.firebaseapp.com",
  projectId: "helixfinale",
  storageBucket: "helixfinale.appspot.com",
  messagingSenderId: "556896526389",
  appId: "1:556896526389:web:0579fb75c4953f716cd17c",
  measurementId: "G-HB0DND8V2J",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const firebaseServices = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
};