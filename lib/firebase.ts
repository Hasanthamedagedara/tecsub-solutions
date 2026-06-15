import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBxJHccT6qiZGsFBYisT8oIUw43mzFldQQ",
    authDomain: "tecsubonline.firebaseapp.com",
    projectId: "tecsubonline",
    storageBucket: "tecsubonline.firebasestorage.app",
    messagingSenderId: "105883522974",
    appId: "1:105883522974:web:693279505a1eb1c29ea88f",
    measurementId: "G-E2R9S024L0",
    databaseURL: "https://tecsubonline-default-rtdb.firebaseio.com"
};

/* ─── Initialize (safe for SSR + hot-reload) ─── */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
