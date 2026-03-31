  function loadHistory() {
  const rollNo = localStorage.getItem("viewHistoryRollNo");
  const jsonObj = JSON.parse(localStorage.getItem("myStudents"));
  
  if (!jsonObj) return;

  const student = jsonObj.students.find(s => s.rollNo === rollNo);
  if (!student) {
    document.getElementById("historyTitle").innerText = "Student Not Found";
    return;
  }

  document.getElementById("historyTitle").innerText = `Borrowing History: ${student.name} (${student.rollNo})`;
  
  const tbody = document.getElementById("historyTableBody");
  tbody.innerHTML = "";

  if(!student.borrowingHistory || student.borrowingHistory.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6' class='text-center py-4'>No borrowing history found for this student.</td></tr>";
    return;
  }

  student.borrowingHistory.forEach(book => {
    
   
    const isReturned = book.returnDate !== null;
    let returnText = "<span class='text-primary fw-bold'>Reading</span>";

    if (isReturned) {
      returnText = book.returnDate;
    } else if (book.status === "Return Pending") {
      returnText = "<span class='text-warning fw-bold'>Return Pending</span>";
    }

    const btnHtml = isReturned 
      ? `<button class="btn btn-sm btn-outline-secondary fw-bold" disabled>Returned</button>`
      : `<button class="btn btn-sm btn-success fw-bold" onclick="markReturned('${rollNo}', '${book.bookId}')">Mark Return</button>`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="align-middle">${book.bookId}</td>
      <td class="align-middle">${book.title}</td>
      <td class="align-middle">${book.issuedDate}</td>
      <td class="align-middle">${book.dueDate}</td>
      <td class="align-middle">${returnText}</td>
      <td class="align-middle text-center">${btnHtml}</td>
    `;
    tbody.appendChild(row);
  });
}

function markReturned(rollNo, bookId) {
  if (!confirm("Are you sure you want to mark this book as returned?")) return;

  let jsonObj = JSON.parse(localStorage.getItem("myStudents"));
  let student = jsonObj.students.find(s => s.rollNo === rollNo);
  
  if (student) {
    let book = student.borrowingHistory.find(b => b.bookId === bookId);
    
    if (book) {
      book.returnDate = new Date().toISOString().split('T')[0];
      
      if(book.status) {
        delete book.status; 
      }

      localStorage.setItem("myStudents", JSON.stringify(jsonObj));
      loadHistory(); 
    }
  }
}