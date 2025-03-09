// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

// Firebase Configuration (Use the one you provided)
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
const db = getDatabase(app);

// Simulated User ID (Use authentication logic in the future)
const userId = "USER_123";

// Function to auto-save input data
function saveUserData(event) {
    const fieldId = event.target.id;  // Get field ID
    const fieldValue = event.target.value;  // Get input value

    // Save to Firebase under "users/{userId}/{fieldId}"
    set(ref(db, `users/${userId}/${fieldId}`), fieldValue);
}

// Function to load saved user data on page load
function loadUserData() {
    get(child(ref(db), `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).forEach((fieldId) => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = data[fieldId];  // Pre-fill inputs
                }
            });
        }
    });
}

// Attach auto-save to all form fields
document.addEventListener("DOMContentLoaded", () => {
    loadUserData(); // Load data when page loads

    document.querySelectorAll("input, textarea, select").forEach((field) => {
        field.addEventListener("input", saveUserData); // Save on change
    });
});
