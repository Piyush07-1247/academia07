// Import Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQJaxsZxHcL1VmfGssXweRVHFKyjVn28k",
  authDomain: "academia07-e25c6.firebaseapp.com",
  projectId: "academia07-e25c6",
  storageBucket: "academia07-e25c6.firebasestorage.app",
  messagingSenderId: "122863126500",
  appId: "1:122863126500:web:21ccfd96b4658629f969f1",
  measurementId: "G-T4DJMKHF8P"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
