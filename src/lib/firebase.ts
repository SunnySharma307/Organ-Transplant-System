// src/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxKW6vih3TM2uVDM22uWlBoV9jqnLTo9A",
  authDomain: "organ-donar-8b960.firebaseapp.com",
  projectId: "organ-donar-8b960",
  storageBucket: "organ-donar-8b960.firebasestorage.app",
  messagingSenderId: "489523895090",
  appId: "1:489523895090:web:4e0302c97a6dbc2357152b",
  measurementId: "G-LYM2VMY9DZ"
};

// Initialize Firebase app (safe for SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics can only be used in the browser and only if supported
let analytics: any = undefined;

// Initialize Auth
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, initializeFirestore } from "firebase/firestore";

let auth: Auth | undefined = undefined;
let db: Firestore | undefined = undefined;

if (typeof window !== "undefined") {
  // Initialize analytics if supported
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore analytics errors
    });

  auth = getAuth(app);
  try {
    db = initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch (e) {
    db = getFirestore(app);
  }
}

export { app, analytics, auth, db };
