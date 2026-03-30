async function validateStudent(event) {
  event.preventDefault();
  var usernameInput = document.getElementById("studentUsername").value;
  var passwordInput = document.getElementById("studentPassword").value;

try {
    const response = await fetch("../../students.json"); 
    const jsonObj = await response.json();

    let loggedInStudent = null;

    var flag = 0;
    for(var i=0; i < jsonObj.students.length; i++) {
      if(jsonObj.students[i].rollNo === usernameInput && jsonObj.students[i].password === passwordInput) {
        loggedInStudent = jsonObj.students[i];
        break;
      }
    }

    if(!loggedInStudent) {
      alert("Invalid Credentials! Try Again.");
    } else {
      localStorage.setItem("currentStudent", JSON.stringify(loggedInStudent));
      window.location.href = "./studentOptions.html";
    }

  } catch (error) {
    console.error("Error loading JSON:", error);
    alert("Could not load the users.json file. Are you running a local server?");
  }
}
