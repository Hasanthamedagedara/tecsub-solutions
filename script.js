import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
