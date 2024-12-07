import { auth, db } from './firebase-config.js'; // Import auth and db from your Firebase config
import { doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"; // Import Firestore functions

const numSubjectsInput = document.getElementById('num-subjects');
const nextStepButton = document.getElementById('next-step');
const subjectsSection = document.getElementById('subjects-section');
const subjectInputsContainer = document.getElementById('subject-inputs');
const generateIconsButton = document.getElementById('generate-icons');
const subjectsIconsSection = document.getElementById('subjects-icons');
const iconsContainer = document.getElementById('icons-container');

let subjects = [];

// Step 1: Handle Number of Subjects Input and Save to Firestore
nextStepButton.addEventListener('click', async () => {
  const numSubjects = parseInt(numSubjectsInput.value);
  if (isNaN(numSubjects) || numSubjects < 1) {
    alert('Please enter a valid number of subjects.');
    return;
  }

  // Get the current user's ID
  const userId = auth.currentUser  ? auth.currentUser .uid : null; 
  if (!userId) {
    alert("User  not authenticated. Please log in.");
    return;
  }

  const userRef = doc(db, "users", userId); // Create a reference to the user's document

  try {
    // Save the number of subjects to Firestore
    await setDoc(userRef, {
      numSubjects: numSubjects
    }, { merge: true });

    // Create inputs for subject names
    subjectInputsContainer.innerHTML = '';
    for (let i = 0; i < numSubjects; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Subject ${i + 1} Name`;
      input.required = true;
      subjectInputsContainer.appendChild(input);
    }

    subjectsSection.classList.remove('hidden');
  } catch (error) {
    console.error("Error saving number of subjects:", error);
    alert("Failed to save number of subjects. Please try again.");
  }
});

// Step 2: Generate Subject Icons and Save Subject Names to Firestore
generateIconsButton.addEventListener('click', async () => {
  const inputs = subjectInputsContainer.querySelectorAll('input');
  subjects = Array.from(inputs).map(input => input.value.trim());
  if (subjects.some(subject => subject === '')) {
    alert('Please enter all subject names.');
    return;
  }

  // Get the current user's ID
  const userId = auth.currentUser  ? auth.currentUser .uid : null; 
  if (!userId) {
    alert("User  not authenticated. Please log in.");
    return;
  }

  const userRef = doc(db, "users", userId); // Create a reference to the user's document

  try {
    // Save the subjects to Firestore (each subject as a document in a subcollection)
    const subjectsRef = collection(userRef, "subjects");
    for (const subject of subjects) {
      const subjectRef = doc(subjectsRef); // Auto-generate document ID
      await setDoc(subjectRef, { name: subject }); // Save the subject name
    }

    // Create icons for subjects
    iconsContainer.innerHTML = '';
    subjects.forEach(subject => {
      const div = document.createElement('div');
      div.className = 'subject-icon';
      div.innerHTML = `
        <img src="book-icon.png" alt="${subject}" />
        <span>${subject}</span>
      `;
      div.addEventListener('click', () => {
        window.location.href = `third-page.html?subject=${encodeURIComponent(subject)}`;
      });
      iconsContainer.appendChild(div);
    });

    subjectsIconsSection.classList.remove('hidden');
  } catch (error) {
    console.error("Error saving subjects:", error);
    alert("Failed to save subjects. Please try again.");
  }
});
