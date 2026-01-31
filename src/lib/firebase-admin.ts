import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import path from "path";

// 1. Construct the path to the Service Account Key file
//    Note: This file must be present on the server (and not committed to public git).
const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");

// 2. Initialize Firebase Admin SDK safely (singleton pattern)
if (getApps().length === 0) {
    try {
        initializeApp({
            credential: cert(serviceAccountPath),
        });
        console.log("Firebase Admin SDK initialized successfully");
    } catch (error) {
        console.error("Firebase Admin SDK initialization error:", error);
    }
}

// 3. Export services
export const adminAuth = getAuth();
export const adminDb = getFirestore();
