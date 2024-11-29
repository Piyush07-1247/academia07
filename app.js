import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Handle login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('Login successful!');
      console.log('User:', userCredential.user);
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Handle registration
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('Registration successful!');
      console.log('User:', userCredential.user);
    })
    .catch((error) => {
      alert(error.message);
    });
});
