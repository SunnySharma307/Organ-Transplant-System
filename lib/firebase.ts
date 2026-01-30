import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:  "AIzaSyCReVDm6bmTZx_Ghtrdc5fwJLF3iQk2sQE",
  authDomain: "organ-donar-e969c.firebaseapp.com",
  projectId: "organ-donar-e969c",
  storageBucket:"organ-donar-e969c.firebasestorage.app",
  messagingSenderId: "176225406708",
  appId: "1:176225406708:web:8141958c96715b465ad8a1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
