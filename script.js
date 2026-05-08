import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXXHwV2GG17rGait_7A3vr5V17T_RCuHQ",
    authDomain: "gen-lang-client-0698552660.firebaseapp.com",
    projectId: "gen-lang-client-0698552660",
    storageBucket: "gen-lang-client-0698552660.firebasestorage.app",
    messagingSenderId: "370839875671",
    appId: "1:370839875671:web:3101dc21da5147adb8f312"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileDiv = document.getElementById('profile');
const loading = document.getElementById('loading');

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUI(user);
    } else {
        loginBtn.style.display = 'flex';
        profileDiv.style.display = 'none';
        loading.style.display = 'none';
    }
});

function updateUI(user) {
    document.getElementById('userName').innerText = user.displayName;
    document.getElementById('userEmail').innerText = user.email;
    document.getElementById('userImg').src = user.photoURL;
    
    loginBtn.style.display = 'none';
    profileDiv.style.display = 'block';
    loading.style.display = 'none';
}

loginBtn.onclick = () => {
    loading.style.display = 'block';
    loginBtn.style.display = 'none';
    signInWithPopup(auth, provider)
        .then((result) => {
            updateUI(result.user);
        })
        .catch((error) => {
            loading.style.display = 'none';
            loginBtn.style.display = 'flex';
            console.error("Login Error:", error.message);
            alert("Login failed: " + error.message);
        });
};

logoutBtn.onclick = () => {
    signOut(auth).then(() => {
        loginBtn.style.display = 'flex';
        profileDiv.style.display = 'none';
    });
};
