import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Using the config provided
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);