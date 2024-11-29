const numSubjectsInput = document.getElementById('num-subjects');
const nextStepButton = document.getElementById('next-step');
const subjectsSection = document.getElementById('subjects-section');
const subjectInputsContainer = document.getElementById('subject-inputs');
const generateIconsButton = document.getElementById('generate-icons');
const subjectsIconsSection = document.getElementById('subjects-icons');
const iconsContainer = document.getElementById('icons-container');

let subjects = [];

// Step 1: Handle Number of Subjects Input
nextStepButton.addEventListener('click', () => {
  const numSubjects = parseInt(numSubjectsInput.value);
  if (isNaN(numSubjects) || numSubjects < 1) {
    alert('Please enter a valid number of subjects.');
    return;
  }
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
});

// Step 2: Generate Subject Icons
generateIconsButton.addEventListener('click', () => {
  const inputs = subjectInputsContainer.querySelectorAll('input');
  subjects = Array.from(inputs).map(input => input.value.trim());
  if (subjects.some(subject => subject === '')) {
    alert('Please enter all subject names.');
    return;
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
});
