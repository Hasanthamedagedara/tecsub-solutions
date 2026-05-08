import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAXXHwV2GG17rGait_7A3vr5V17T_RCuHQ",
    authDomain: "gen-lang-client-0698552660.firebaseapp.com",
    projectId: "gen-lang-client-0698552660",
    storageBucket: "gen-lang-client-0698552660.firebasestorage.app",
    messagingSenderId: "370839875671",
    appId: "1:370839875671:web:3101dc21da5147adb8f312"
};

/* ─── Initialize (safe for SSR + hot-reload) ─── */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
