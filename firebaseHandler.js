// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
    onAuthStateChanged, GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQJaxsZxHcL1VmfGssXweRVHFKyjVn28k",
  authDomain: "academia07-e25c6.firebaseapp.com",
  databaseURL: "https://academia07-e25c6-default-rtdb.firebaseio.com",
  projectId: "academia07-e25c6",
  storageBucket: "academia07-e25c6.appspot.com",
  messagingSenderId: "122863126500",
  appId: "1:122863126500:web:21ccfd96b4658629f969f1",
  measurementId: "G-T4DJMKHF8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// 🟢 **Register User**
function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        alert("Registration Successful!");
        window.location.href = "index.html";  // Redirect to main page
    })
    .catch((error) => {
        alert(error.message);
    });
}

// 🟢 **Login User**
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        alert("Login Successful!");
        window.location.href = "index.html"; // Redirect to dashboard
    })
    .catch((error) => {
        alert(error.message);
    });
}

// 🟢 **Google Sign-In**
function googleLogin() {
    signInWithPopup(auth, provider)
    .then((result) => {
        alert("Google Sign-In Successful!");
        window.location.href = "index.html";  // Redirect
    })
    .catch((error) => {
        alert(error.message);
    });
}

// 🟢 **Logout User**
function logoutUser() {
    signOut(auth)
    .then(() => {
        alert("Logged Out!");
        window.location.href = "login.html";  // Redirect to login page
    })
    .catch((error) => {
        alert(error.message);
    });
}

// 🟢 **Check if User is Logged In**
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("logoutBtn").style.display = "block";  // Show logout button
    } else {
        document.getElementById("logoutBtn").style.display = "none";  // Hide logout button
    }
});

// 🟢 **Auto-Save User Data**
function saveUserData(event) {
    const user = auth.currentUser;
    if (!user) return;

    const fieldId = event.target.id;
    const fieldValue = event.target.value;

    set(ref(db, `users/${user.uid}/${fieldId}`), fieldValue);
}

// 🟢 **Load User Data Automatically**
function loadUserData() {
    const user = auth.currentUser;
    if (!user) return;

    get(child(ref(db), `users/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).forEach((fieldId) => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = data[fieldId]; // Pre-fill input fields
                }
            });
        }
    });
}

// Attach auto-save to form fields when user is logged in
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserData();
            document.querySelectorAll("input, textarea, select").forEach((field) => {
                field.addEventListener("input", saveUserData);
            });
        }
    });
});

// Expose functions for HTML pages
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.googleLogin = googleLogin;
