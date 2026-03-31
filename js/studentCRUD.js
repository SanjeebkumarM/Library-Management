// 1. Fetch from JSON and save to localStorage (Run this when page loads)
async function initializeAndLoadStudents() {
  if (!localStorage.getItem("myStudents")) {
    try {
      const response = await fetch("../../students.json");
      const jsonObj = await response.json();
      localStorage.setItem("myStudents", JSON.stringify(jsonObj));
    } catch (error) {
      console.error("Failed to fetch students.json", error);
    }
  }

  loadStudentTable();
}
function loadStudentTable() {
  const jsonString = localStorage.getItem("myStudents");
  if (!jsonString) return;
  
  const jsonObj = JSON.parse(jsonString);
  const tbody = document.querySelector("table tbody");
  
  if (!tbody) return; 
  
  tbody.innerHTML = "";

  jsonObj.students.forEach((student, index) => {
    const trow = document.createElement("tr");
    
    // Extracting branch from Roll No (e.g., CSE-24028 -> CSE)
    const branch = student.rollNo.split('-')[0]; 

    trow.innerHTML = `
      <th scope="row" class="align-middle">${index + 1}</th>
      <td class="align-middle">${branch}</td>
      <td class="align-middle">${student.name}</td>
      <td class="align-middle">${student.rollNo}</td>
      <td class="table_buttons text-center align-middle">
        <a class="delete" href="#" onclick="viewHistory('${student.rollNo}')" title="Check borrowing history">
        <button class="btn btn-outline-primary"><i class="material-icons">library_books</i></button>
        </a>
      </td>
      <td class="table_buttons text-center align-middle">
        <a class="edit" href="#" onclick="rememberStudent('${student.rollNo}', '${student.name}')" title="Edit Student Info">
          <button class="btn btn-outline-warning"><i class="material-icons">edit</i></button>
        </a>
      </td>
    `;
    tbody.appendChild(trow);
  });
}

function rememberStudent(rollNo, name) {
  var saveObj = {
    "rollNo": rollNo,
    "name": name
  };
  localStorage.setItem("studentToEdit", JSON.stringify(saveObj));
  window.location.href = "editStudent.html"; 
}

function viewHistory(rollNo) {
  localStorage.setItem("viewHistoryRollNo", rollNo);
  window.location.href = "studentHistory.html";
}

function openAddStudentModal() {
  document.getElementById("addStudentForm").reset();
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addStudentModal'));
  modal.show();
}

function cancelAddStudent() {
  document.getElementById("addStudentForm").reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
  if (modal) {
    modal.hide();
  }
}
function addNewStudent(event) {
  event.preventDefault();

  const nameInput = document.getElementById("addStudentName").value;
  const rollInput = document.getElementById("addStudentRoll").value;
  const passwordInput = document.getElementById("addStudentPassword").value;

  if(nameInput === "" || rollInput === "" || passwordInput === "") {
    alert("All fields are required to add a new student.");
    return;
  }

  const newStudent = {
    studentCardId: rollInput, 
    name: nameInput,
    rollNo: rollInput,
    password: passwordInput,
    borrowingHistory: [] 
  };

  let jsonString = localStorage.getItem("myStudents");
  let jsonObj = JSON.parse(jsonString);

  const exists = jsonObj.students.find(s => s.rollNo === rollInput);
  if (exists) {
    alert("A student with this Roll Number already exists!");
    return;
  }

  jsonObj.students.push(newStudent);
  localStorage.setItem("myStudents", JSON.stringify(jsonObj));

  const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
  if (modal) {
    modal.hide();
  }
  
  document.getElementById("addStudentForm").reset();
  
  alert("Student added successfully!");
  
  loadStudentTable();
}