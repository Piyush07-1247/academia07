function navigateTo(page) {
  switch (page) {
    case 'login':
      alert("Redirecting to Login...");
       window.location.href = 'file:///F:/DOWNLOADS/PROJECT/login.html'; // Ensure page exists
      break;
    case 'register':
      alert("Redirecting to Register...");
      window.location.href = 'file:///F:/DOWNLOADS/PROJECT/register.html'; // Ensure page exists
      break;
    case 'attendance':
      window.location.href = 'file:///F:/DOWNLOADS/PROJECT/attendance/attend.html'; // Ensure page exists
      break;
    case 'marks':
      window.location.href = 'file:///F:/DOWNLOADS/PROJECT/internal/internal.html'; // Ensure page exists
      break;
    case 'cgpa':
      window.location.href = 'file:///F:/DOWNLOADS/PROJECT/cgpa/cgpa.html'; // Ensure page exists
      break;
    default:
      alert('Coming Soon!');
  }
}
