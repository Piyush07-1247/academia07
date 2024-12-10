const marksForm = document.getElementById('marks-form');

marksForm.addEventListener('submit', (event) => {
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

  // Open a new window and display results
  const resultPage = window.open('', '_blank');
  resultPage.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Internal Marks Results</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f9f9f9;
          color: #333;
          text-align: center;
        }
        .summary {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #007BFF;
        }
        p {
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="summary">
        <h2>Results</h2>
        <p><strong>Best 2 ST Marks Total:</strong> ${stTotal.toFixed(2)} (out of 15)</p>
        <p><strong>Assignments Marks:</strong> ${assignmentsTotal} (out of 5)</p>
        <p><strong>Quizzes Marks:</strong> ${quizzesTotal} (out of 5)</p>
        <p><strong>Attendance Marks:</strong> ${attendanceMarks} (out of 5)</p>
        <p><strong>Total Marks:</strong> ${total.toFixed(2)} (out of 30)</p>
      </div>
    </body>
    </html>
  `);
  resultPage.document.close();
});
