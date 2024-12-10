function navigateTo(page) {
  switch (page) {
    case 'login':
      alert("Redirecting to Login...");
       window.location.href = 'login.html'; // Ensure page exists
      break;
    case 'register':
      alert("Redirecting to Register...");
      window.location.href = 'register.html'; // Ensure page exists
      break;
    case 'attendance':
      window.location.href = 'attend.html'; // Ensure page exists
      break;
    case 'marks':
      window.location.href = 'internal.html'; // Ensure page exists
      break;
    case 'cgpa':
      window.location.href = 'cgpa.html'; // Ensure page exists
      break;
    default:
      alert('Coming Soon!');
  }
}
