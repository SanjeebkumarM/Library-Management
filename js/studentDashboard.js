document.addEventListener('DOMContentLoaded', function() {
  
  // Retrieves the student data from localStorage
  const studentDataString = localStorage.getItem("currentStudent");

  if (!studentDataString) {
    alert("You must log in first!");
    window.location.href = "./studentLogin.html";
    return; 
  }
  const student = JSON.parse(studentDataString);

  document.getElementById("navStudentName").innerText = student.name || "Student";
  document.getElementById("navStudentRoll").innerText = student.rollNo || "Unknown Roll";
  document.getElementById("navStudentCard").innerText = student.studentCardId || "Unknown ID";
});

function logout() {
  localStorage.removeItem("currentStudent");
  window.location.href = "./studentLogin.html";
}


// Students Borrowing History Logic
function loadStudentBooks() {
  const tbody = document.getElementById("studentBooksTableBody");
  if (!tbody) return;

  const currentStudentData = JSON.parse(localStorage.getItem("currentStudent"));
  if (!currentStudentData) return;


  const jsonObj = JSON.parse(localStorage.getItem("myStudents"));
  const student = jsonObj.students.find(s => s.rollNo === currentStudentData.rollNo);

  if (!student) return;

  tbody.innerHTML = "";

  if (!student.borrowingHistory || student.borrowingHistory.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5' class='text-center'>You have no borrowed books.</td></tr>";
    return;
  }

  student.borrowingHistory.forEach((book) => {
    let displayStatus = "<span class='text-primary fw-bold'>Reading</span>";
    let checkboxHtml = `<input type="checkbox" value="${book.bookId}" class="return-checkbox" style="height: 18px; width: 18px;">`;

    if (book.returnDate) {
        displayStatus = `<span class='text-success fw-bold'>Returned (${book.returnDate})</span>`;
        checkboxHtml = `<input type="checkbox" disabled title="Already returned">`;
    } else if (book.status === "Return Pending") {
        displayStatus = "<span class='text-warning fw-bold'>Return Pending</span>";
        checkboxHtml = `<input type="checkbox" disabled title="Waiting for librarian approval">`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="student_checkbox text-center align-middle">${checkboxHtml}</td>
        <td class="align-middle">${book.title}</td>
        <td class="align-middle">${book.issuedDate}</td>
        <td class="align-middle">${book.dueDate}</td>
        <td class="align-middle">${displayStatus}</td>
    `;
    tbody.appendChild(row);
  });
}

function requestReturn(event) {
  event.preventDefault();
  
  const checkboxes = document.querySelectorAll(".return-checkbox:checked");
  if (checkboxes.length === 0) {
    alert("Please select at least one book to return.");
    return;
  }

  const currentStudentData = JSON.parse(localStorage.getItem("currentStudent"));
  let jsonObj = JSON.parse(localStorage.getItem("myStudents"));
  let studentIndex = jsonObj.students.findIndex(s => s.rollNo === currentStudentData.rollNo);

  if (studentIndex !== -1) {
    let updatedCount = 0;
    
    checkboxes.forEach(cb => {
        let bookId = cb.value;
        let book = jsonObj.students[studentIndex].borrowingHistory.find(b => b.bookId === bookId);
        if (book && !book.returnDate) {
            book.status = "Return Pending";
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        localStorage.setItem("myStudents", JSON.stringify(jsonObj));
        
        localStorage.setItem("currentStudent", JSON.stringify(jsonObj.students[studentIndex]));
        
        alert(`Successfully marked ${updatedCount} book(s) as Return Pending. Please drop them at the desk!`);
        loadStudentBooks();
    }
  }
}