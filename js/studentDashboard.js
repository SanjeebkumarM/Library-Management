document.addEventListener('DOMContentLoaded', function() {
  
  // Retrieves the student data from localStorage
  const studentDataString = localStorage.getItem("currentStudent");

  if (!studentDataString) {
    alert("You must log in first!");
    window.location.href = "/html/student/studentLogin.html";
    return; 
  }
  const student = JSON.parse(studentDataString);

  document.getElementById("navStudentName").innerText = student.name || "Student";
  document.getElementById("navStudentRoll").innerText = student.rollNo || "Unknown Roll";
  document.getElementById("navStudentCard").innerText = student.studentCardId || "Unknown ID";
});

function logout() {
  localStorage.removeItem("currentStudent");
  window.location.href = "/html/student/studentLogin.html";
}