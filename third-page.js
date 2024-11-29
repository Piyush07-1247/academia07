const marksForm = document.getElementById('marks-form');
const summaryDiv = document.getElementById('summary');
const stSummary = document.getElementById('st-summary');
const assignmentsSummary = document.getElementById('assignments-summary');
const quizzesSummary = document.getElementById('quizzes-summary');
const attendanceSummary = document.getElementById('attendance-summary');
const totalSummary = document.getElementById('total-summary');
const manageSubjectButton = document.getElementById('manage-subject');

// Firestore setup
const userId = auth.currentUser.uid; // Get the current user's ID
const subjectName = new URLSearchParams(window.location.search).get('subject'); // Get the subject name from URL

marksForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get input values
  const st1 = parseInt(document.getElementById('st1-marks').value);
  const st2 = parseInt(document.getElementById('st2-marks').value);
  const st3 = parseInt(document.getElementById('st3-marks').value);
  const assignments = parseInt(document.getElementById('assignments').value);
  const quizzes = parseInt(document.getElementById('quizzes').value);
  const attendance = parseInt(document.getElementById('attendance').value);

  // Calculate best 2 ST marks
  const stMarks = [st1, st2, (st3 * 30) / 40].sort((a, b) => b - a).slice(0, 2);
  const stTotal = (stMarks[0] * 7.5) / 30 + (stMarks[1] * 7.5) / 30;

  // Assignments and quizzes marks
  const assignmentsTotal = Math.min(assignments, 5);
  const quizzesTotal = Math.min(quizzes, 5);

  // Attendance marks
  let attendanceMarks = 3;
  if (attendance >= 85) attendanceMarks = 5;
  else if (attendance >= 75) attendanceMarks = 4;

  // Total marks
  const total = stTotal + assignmentsTotal + quizzesTotal + attendanceMarks;

  // Display summary
  stSummary.textContent = `Best 2 ST Marks Total: ${stTotal.toFixed(2)} (out of 15)`;
  assignmentsSummary.textContent = `Assignments Marks: ${assignmentsTotal} (out of 5)`;
  quizzesSummary.textContent = `Quizzes Marks: ${quizzesTotal} (out of 5)`;
  attendanceSummary.textContent = `Attendance Marks: ${attendanceMarks} (out of 5)`;
  totalSummary.textContent = `Total Marks: ${total.toFixed(2)} (out of 30)`;

  summaryDiv.classList.remove('hidden');

  // Save data to Firestore
  const userRef = doc(db, "users", userId);
  const subjectRef = doc(userRef, "subjects", subjectName); // Reference to the specific subject

  await setDoc(subjectRef, {
    st1Marks: st1,
    st2Marks: st2,
    st3Marks: st3,
    assignmentsMarks: assignmentsTotal,
    quizzesMarks: quizzesTotal,
    attendanceMarks: attendanceMarks,
    totalMarks: total,
    timestamp: new Date() // Save the timestamp when the data is entered
  }, { merge: true }); // Use merge: true to avoid overwriting existing data

  // Optionally, you can also store a summary or any additional information here
  await setDoc(doc(userRef, "subjects_summary", subjectName), {
    summary: {
      stTotal: stTotal.toFixed(2),
      assignmentsTotal: assignmentsTotal,
      quizzesTotal: quizzesTotal,
      attendanceMarks: attendanceMarks,
      total: total.toFixed(2)
    }
  }, { merge: true });
});

// Navigate to the fourth page
manageSubjectButton.addEventListener('click', () => {
  window.location.href = 'fourth-page.html';
});
