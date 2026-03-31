async function validateStudent(event) {
  event.preventDefault();
  
  var usernameInput = document.getElementById("studentUsername").value;
  var passwordInput = document.getElementById("studentPassword").value;

  try {
    let jsonObj;

    const localData = localStorage.getItem("myStudents");

    if (localData) {
      jsonObj = JSON.parse(localData);
    } else {
      const response = await fetch("../../students.json"); 
      jsonObj = await response.json();
      
      localStorage.setItem("myStudents", JSON.stringify(jsonObj));
    }

    let loggedInStudent = null;

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
    console.error("Error loading JSON or parsing data:", error);
    alert("Could not load the student data. Are you running a local server?");
  }
}