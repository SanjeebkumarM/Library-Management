document.addEventListener('DOMContentLoaded', function() {
  
  // Retrieves the student data from localStorage
  const adminDataString = localStorage.getItem("currentAdmin");

  if (!adminDataString) {
    alert("You must log in first!");
    window.location.href = "librarianLogin.html";
    return; 
  }
  const admin = JSON.parse(adminDataString);

  document.getElementById("navAdminRole").innerText = admin.role || "Librarian";
  document.getElementById("navAdminUser").innerText = admin.userName || "Username";
  document.getElementById("navEmployeeID").innerText = admin.employeeID || "Unknown ID";
});

function logout() {
  localStorage.removeItem("currentAdmin");
  window.location.href = "librarianLogin.html";
}