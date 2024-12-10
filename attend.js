function calculateBunks() {
    const requiredPercentage = parseFloat(document.getElementById('requiredPercentage').value);
    const totalClasses = parseFloat(document.getElementById('totalClasses').value);
    const attendedClasses = parseFloat(document.getElementById('attendedClasses').value);

    if (isNaN(requiredPercentage) || isNaN(totalClasses) || isNaN(attendedClasses)) {
        document.getElementById('result').innerText = "Please enter valid values.";
        return;
    }

    const currentPercentage = (attendedClasses / totalClasses) * 100;
    let resultMessage = '';

    if (currentPercentage < requiredPercentage) {
        let additionalLecturesNeeded = 0;
        while (((attendedClasses + additionalLecturesNeeded) / (totalClasses + additionalLecturesNeeded)) * 100 < requiredPercentage) {
            additionalLecturesNeeded++;
        }
        resultMessage = `You need to attend ${additionalLecturesNeeded} more lectures to meet the required ${requiredPercentage}% attendance.`;
    } else {
        let maxMissableClasses = 0;
        while (((attendedClasses / (totalClasses + maxMissableClasses)) * 100) >= requiredPercentage) {
            maxMissableClasses++;
        }
        maxMissableClasses--;
        resultMessage = `Hooray! You can miss ${maxMissableClasses} more lectures and still maintain the required attendance.`;
    }

    const currentAttendanceMessage = `Current Attendance Percentage: ${currentPercentage.toFixed(2)}%`;
    const missedPercentage = (attendedClasses / (totalClasses + 1)) * 100;
    const attendedPercentage = ((attendedClasses + 1) / (totalClasses + 1)) * 100;
    const effectMessage = `If you miss 1 lecture, your attendance will decrease to ${missedPercentage.toFixed(2)}%. 
                           If you attend 1 more lecture, your attendance will increase to ${attendedPercentage.toFixed(2)}%.`;

    document.getElementById('result').innerHTML = resultMessage;
    document.getElementById('currentAttendance').innerHTML = currentAttendanceMessage;
    document.getElementById('attendanceUpdate').innerHTML = effectMessage;

    document.getElementById('formContainer').style.display = "none";
    document.getElementById('resultContainer').style.display = "block";
}

function predictAttendance() {
    const lecturesToAttend = parseInt(document.getElementById('lecturesToAttend').value);
    const lecturesToMiss = parseInt(document.getElementById('lecturesToMiss').value);
    const totalClasses = parseFloat(document.getElementById('totalClasses').value);
    const attendedClasses = parseFloat(document.getElementById('attendedClasses').value);
    const requiredPercentage = parseFloat(document.getElementById('requiredPercentage').value);

    if (isNaN(lecturesToAttend) || isNaN(lecturesToMiss) || lecturesToAttend < 0 || lecturesToMiss < 0) {
        alert('Please enter valid values for lectures to attend and miss.');
        return;
    }

    const predictedAttendedClasses = attendedClasses + lecturesToAttend;
    const predictedTotalClasses = totalClasses + lecturesToAttend + lecturesToMiss;
    const predictedAttendancePercentage = (predictedAttendedClasses / predictedTotalClasses) * 100;
    const difference = predictedAttendancePercentage - requiredPercentage;

    document.getElementById('updatedClassesInfo').innerText = `New Total Classes: ${predictedTotalClasses}, New Attended Classes: ${predictedAttendedClasses}`;
    document.getElementById('predictedAttendanceInfo').innerText = `Predicted Attendance Percentage: ${predictedAttendancePercentage.toFixed(2)}%`;
    document.getElementById('attendanceDifferenceInfo').innerText = `Difference from Required Attendance: ${difference.toFixed(2)}%`;

    let attendanceMessage = '';
    if (difference < 0) {
        let additionalLecturesNeeded = 0;
        while (((predictedAttendedClasses + additionalLecturesNeeded) / (predictedTotalClasses + additionalLecturesNeeded)) * 100 < requiredPercentage) {
            additionalLecturesNeeded++;
        }
        attendanceMessage = `You need to attend ${additionalLecturesNeeded} more lectures to reach the required ${requiredPercentage}% attendance.`;
    } else {
        let maxMissableClasses = 0;
        while (((predictedAttendedClasses / (predictedTotalClasses + maxMissableClasses)) * 100) >= requiredPercentage) {
            maxMissableClasses++;
        }
        maxMissableClasses--;
        attendanceMessage = `Hooray! You can miss ${maxMissableClasses} more lectures and still maintain the required attendance.`;
    }

    document.getElementById('attendanceAdviceInfo').innerText = attendanceMessage;

    document.getElementById('predictionContainer').style.display = "none";
    document.getElementById('predictionResult').style.display = "block";
}

function goBack() {
    document.getElementById('formContainer').style.display = "block";
    document.getElementById('resultContainer').style.display = "none";
}

function goToPredictionPage() {
    document.getElementById('resultContainer').style.display = "none";
    document.getElementById('predictionContainer').style.display = "block";
}

function goBackToMain() {
    document.getElementById('predictionResult').style.display = "none";
    document.getElementById('formContainer').style.display = "block";
}

function goBackToPrediction() {
    document.getElementById('predictionResult').style.display = "none";
    document.getElementById('predictionContainer').style.display = "block";
}