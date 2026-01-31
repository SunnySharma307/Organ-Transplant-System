// lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCReVDm6bmTZx_Ghtrdc5fwJLF3iQk2sQE",
  authDomain: "organ-donar-e969c.firebaseapp.com",
  projectId: "organ-donar-e969c",
  storageBucket: "organ-donar-e969c.firebasestorage.app",
  messagingSenderId: "176225406708",
  appId: "1:176225406708:web:8141958c96715b465ad8a1",
  measurementId: "G-Y75XZNMS7C"
};

// Initialize Firebase app (safe for SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics can only be used in the browser and only if supported
let analytics: any = undefined;

// Auth should also be browser-only; initialize safely
import { getAuth } from "firebase/auth";
let auth: ReturnType<typeof getAuth> | undefined = undefined;

if (typeof window !== "undefined") {
  // Initialize analytics if supported
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore analytics errors on older browsers or incognito modes
    });

  // Initialize auth in the browser
  try {
    auth = getAuth(app);
  } catch (e) {
    // Ignore auth init errors in some environments
  }

  // Initialize Firestore if running in browser (for simple profile persistence)
  try {
    import("firebase/firestore")
      .then(({ getFirestore }) => {
        const dbInstance = getFirestore(app);
        (globalThis as any).__firebase_db = dbInstance;
      })
      .catch(() => {
        // ignore
      });
  } catch (e) {
    // ignore
  }
}

// Expose db if it was created in the browser
const db = (globalThis as any).__firebase_db as import("firebase/firestore").Firestore | undefined;

export { app, analytics, auth, db };
