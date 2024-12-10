function showSGPACalculator() {
  const dynamicSection = document.getElementById('dynamic-section');
  dynamicSection.innerHTML = `
    <h2>SGPA Calculation</h2>
    <label>Number of Subjects:</label>
    <input type="number" id="numSubjects" min="1">
    <button onclick="generateSGPAFields()">Next</button>
    <div id="sgpa-fields"></div>
    <div id="sgpa-result" class="result"></div>
  `;
}

function generateSGPAFields() {
  const numSubjects = document.getElementById('numSubjects').value;
  const sgpaFields = document.getElementById('sgpa-fields');
  let fieldsHTML = '<h3>Enter Subject Details:</h3>';
  
  for (let i = 1; i <= numSubjects; i++) {
    fieldsHTML += `
      <div class="input-group">
        <label>Subject ${i} Name:</label>
        <input type="text" id="subject${i}" placeholder="Subject Name">
        <label>Credits:</label>
        <input type="number" id="credits${i}" min="1">
        <label>Marks:</label>
        <input type="number" id="marks${i}" min="0" max="100">
      </div>
    `;
  }
  fieldsHTML += '<button onclick="calculateSGPA()">Calculate SGPA</button>';
  sgpaFields.innerHTML = fieldsHTML;
}

function calculateSGPA() {
  const numSubjects = document.getElementById('numSubjects').value;
  let totalCreditPoints = 0, totalCredits = 0;

  for (let i = 1; i <= numSubjects; i++) {
    const credits = parseFloat(document.getElementById(`credits${i}`).value);
    const marks = parseFloat(document.getElementById(`marks${i}`).value);

    // Determine Grade Point from Marks
    let gradePoint = 0;
    if (marks >= 90) gradePoint = 10;
    else if (marks >= 80) gradePoint = 9;
    else if (marks >= 70) gradePoint = 8;
    else if (marks >= 60) gradePoint = 7;
    else if (marks >= 50) gradePoint = 6;
    else if (marks >= 45) gradePoint = 5;
    else if (marks >= 40) gradePoint = 4;
    else gradePoint = 0;

    totalCredits += credits;
    totalCreditPoints += credits * gradePoint;
  }

  const sgpa = (totalCreditPoints / totalCredits).toFixed(2);
  document.getElementById('sgpa-result').innerHTML = `<strong>Your SGPA is:</strong> ${sgpa}`;
}

function showCGPACalculator() {
  const dynamicSection = document.getElementById('dynamic-section');
  dynamicSection.innerHTML = `
    <h2>CGPA Calculation</h2>
    <label>Number of Semesters:</label>
    <input type="number" id="numSemesters" min="1">
    <button onclick="generateCGPAFields()">Next</button>
    <div id="cgpa-fields"></div>
    <div id="cgpa-result" class="result"></div>
  `;
}

function generateCGPAFields() {
  const numSemesters = document.getElementById('numSemesters').value;
  const cgpaFields = document.getElementById('cgpa-fields');
  let fieldsHTML = '<h3>Enter Semester Details:</h3>';

  for (let i = 1; i <= numSemesters; i++) {
    fieldsHTML += `
      <div class="input-group">
        <label>Semester ${i} SGPA:</label>
        <input type="number" id="sgpa${i}" min="0" max="10">
        <label>Total Credits:</label>
        <input type="number" id="totalCredits${i}" min="1">
      </div>
    `;
  }
  fieldsHTML += '<button onclick="calculateCGPA()">Calculate CGPA</button>';
  cgpaFields.innerHTML = fieldsHTML;
}

function calculateCGPA() {
  const numSemesters = document.getElementById('numSemesters').value;
  let totalPoints = 0, totalCredits = 0;

  for (let i = 1; i <= numSemesters; i++) {
    const sgpa = parseFloat(document.getElementById(`sgpa${i}`).value);
    const credits = parseFloat(document.getElementById(`totalCredits${i}`).value);
    totalPoints += sgpa * credits;
    totalCredits += credits;
  }

  const cgpa = (totalPoints / totalCredits).toFixed(2);
  document.getElementById('cgpa-result').innerHTML = `<strong>Your CGPA is:</strong> ${cgpa}`;
}

function showAwards() {
  const dynamicSection = document.getElementById('dynamic-section');
  dynamicSection.innerHTML = `
    <h2>Ranks & Awards</h2>
    <div class="checkbox-group">
      <label><input type="checkbox" disabled checked> <strong>Honours Degree:</strong> CGPA ≥ 7.5, 160 credits + 20 extra credits through nptel MOOCS,cleared all subjects at one go means no back</label>
      <label><input type="checkbox" disabled checked> <strong>First Division:</strong> CGPA 6.5 - 7.49</label>
      <label><input type="checkbox" disabled checked> <strong>Distinction:</strong> CGPA ≥ 7.5, no gaps</label>
    </div>
  `;
}
