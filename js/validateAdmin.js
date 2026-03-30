async function validateAdmin(event) {
  event.preventDefault();
  var usernameInput = document.getElementById("adminUsername").value;
  var passwordInput = document.getElementById("adminPassword").value;

try {
    const response = await fetch("../../librarians.json"); 
    const jsonObj = await response.json();

    let loggedInAdmin = null;

    var flag = 0;
    for(var i=0; i < jsonObj.librarians.length; i++) {
      if(jsonObj.librarians[i].userName === usernameInput && jsonObj.librarians[i].password === passwordInput) {
        loggedInAdmin = jsonObj.librarians[i];
        break;
      }
    }

    if(!loggedInAdmin) {
      alert("Invalid Credentials! Try Again.");
    } else {
      localStorage.setItem("currentAdmin", JSON.stringify(loggedInAdmin));
      window.location.href = "./adminOptions.html";
    }

  } catch (error) {
    console.error("Error loading JSON:", error);
    alert("Could not load the users.json file. Are you running a local server?");
  }
}
