document.getElementById('generateSubjects').addEventListener('click', function() {
    const subjectCount = parseInt(document.getElementById('subjectCount').value);
    const subjectInputs = document.getElementById('subjectInputs');
    subjectInputs.innerHTML = '';

    for (let i = 0; i < subjectCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Enter Subject Name ${i + 1}`;
        input.classList.add('subject-input');
        input.dataset.index = i;
        subjectInputs.appendChild(input);
    }

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Create Subjects';
    submitBtn.addEventListener('click', createSubjectCards);
    subjectInputs.appendChild(submitBtn);
});

function createSubjectCards() {
    const subjectInputs = document.querySelectorAll('.subject-input');
    const subjectCards = document.getElementById('subjectCards');
    subjectCards.innerHTML = '';

    subjectInputs.forEach(input => {
        const subjectName = input.value;
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = subjectName;
        card.dataset.subject = subjectName;

        card.addEventListener('click', function() {
            openSubjectDetails(subjectName);
        });

        subjectCards.appendChild(card);
    });

    saveSubjectsToLocal();
}

function openSubjectDetails(subjectName) {
    document.getElementById('subjectTitle').textContent = subjectName;
    document.getElementById('subjectDetails').classList.remove('hidden');
    document.getElementById('subjectCards').classList.add('hidden');

    // Load saved data for subject
    const subjectData = loadSubjectData(subjectName);
    if (subjectData) {
        document.getElementById('assignmentsDone').value = subjectData.assignments || 0;
        document.getElementById('chaptersDone').value = subjectData.chapters || 0;
        document.getElementById('notesLink').value = subjectData.notes || '';

        updateProgress('assignmentProgress', subjectData.assignments || 0);
        updateProgress('chapterProgress', subjectData.chapters || 0);

        if (subjectData.notes) {
            const notesButton = document.getElementById('notesButton');
            notesButton.href = subjectData.notes;
            notesButton.classList.remove('hidden');
        }
    }

    document.getElementById('saveNotes').onclick = function() {
        saveSubjectDetails(subjectName);
    };
}

function updateProgress(barId, value) {
    const progressBar = document.getElementById(barId);
    progressBar.innerHTML = `<div style="width: ${value * 20}%"></div>`;
}

function saveSubjectDetails(subjectName) {
    const assignments = parseInt(document.getElementById('assignmentsDone').value) || 0;
    const chapters = parseInt(document.getElementById('chaptersDone').value) || 0;
    const notes = document.getElementById('notesLink').value;

    const subjectData = {
        assignments: assignments,
        chapters: chapters,
        notes: notes
    };

    localStorage.setItem(subjectName, JSON.stringify(subjectData));
    alert('Details saved!');
}

function saveSubjectsToLocal() {
    const subjects = [];
    document.querySelectorAll('.subject-input').forEach(input => {
        subjects.push(input.value);
    });
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

function loadSubjectData(subjectName) {
    return JSON.parse(localStorage.getItem(subjectName));
}

document.getElementById('backToSubjects').addEventListener('click', function() {
    document.getElementById('subjectDetails').classList.add('hidden');
    document.getElementById('subjectCards').classList.remove('hidden');
});

// Load saved subjects on page load
window.onload = function() {
    const savedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    savedSubjects.forEach(subject => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = subject;
        card.dataset.subject = subject;

        card.addEventListener('click', function() {
            openSubjectDetails(subject);
        });

        document.getElementById('subjectCards').appendChild(card);
    });
};
