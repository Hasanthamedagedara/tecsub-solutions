import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/* ═══════════════════════════════════════════════
   Firebase Configuration
   ═══════════════════════════════════════════════
   Replace the placeholder values below with your
   real Firebase project credentials from:
   https://console.firebase.google.com
   → Project Settings → Your apps → Web app config
   ═══════════════════════════════════════════════ */
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

/* ─── Initialize (safe for SSR + hot-reload) ─── */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;
