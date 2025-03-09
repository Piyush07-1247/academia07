// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
    onAuthStateChanged, GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
window.registerUser = function () {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        alert("Registration Successful!");
        window.location.href = "login.html"; // Redirect to login
    })
    .catch((error) => {
        alert(error.message);
    });
};

// 🟢 **Login User**
window.loginUser = function () {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        alert("Login Successful!");
        window.location.href = "index.html"; // Redirect to dashboard
    })
    .catch((error) => {
        alert(error.message);
    });
};

// 🟢 **Google Login**
window.googleLogin = function () {
    signInWithPopup(auth, provider)
    .then((result) => {
        alert("Google Login Successful!");
        window.location.href = "index.html"; // Redirect
    })
    .catch((error) => {
        alert(error.message);
    });
};

// 🟢 **Logout User**
window.logoutUser = function () {
    signOut(auth)
    .then(() => {
        alert("Logged Out!");
        window.location.href = "login.html"; // Redirect to login
    })
    .catch((error) => {
        alert(error.message);
    });
};

// 🟢 **Check if User is Logged In**
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("logoutBtn")?.style.display = "block";  // Show logout button
    } else {
        document.getElementById("logoutBtn")?.style.display = "none";  // Hide logout button
    }
});
