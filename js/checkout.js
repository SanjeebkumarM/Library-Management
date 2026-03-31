function goToCheckout(event) {
  event.preventDefault();
  const branchSelect = document.getElementById("branchSelect");
  const selectedBranch = branchSelect.value;

  if (selectedBranch === "Select a branch...") {
    alert("Please select a valid branch first.");
    return;
  }

  // Save the selection so the next page knows what to load
  localStorage.setItem("studentSelectedBranch", selectedBranch);
  window.location.href = "./checkoutBook.html";
}

// Checkout Books Logic ---
async function loadCheckoutBooks() {
  const tbody = document.getElementById("checkoutTableBody");
  if (!tbody) return;

  const branch = localStorage.getItem("studentSelectedBranch");
  if (!branch) {
    window.location.href = "./selectBranch.html";
    return;
  }

  document.getElementById("catalogTitle").innerText = `Books Catalog: ${branch}`;

  // Check and load default books if they don't exist yet
  if (!localStorage.getItem("myBooks")) {
    try {
      const response = await fetch("../../books.json");
      const jsonObj = await response.json();
      localStorage.setItem("myBooks", JSON.stringify(jsonObj));
    } catch(e) {
      console.error("Failed to load books.json", e);
    }
  }

  const jsonObj = JSON.parse(localStorage.getItem("myBooks")) || { books: [] };
  const studentsObj = JSON.parse(localStorage.getItem("myStudents")) || { students: [] };
  const branchBooks = jsonObj.books.filter(b => b.branch === branch);

  tbody.innerHTML = "";

  if (branchBooks.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4' class='text-center py-4'>No books currently available in this branch.</td></tr>";
    return;
  }

  branchBooks.forEach(book => {
    // Calculate dynamic stock
    let borrowedCount = 0;
    studentsObj.students.forEach(student => {
      student.borrowingHistory.forEach(history => {
        if (history.bookId === book.bookId && history.returnDate === null) {
          borrowedCount++;
        }
      });
    });

    const availableStock = book.totalCopies - borrowedCount;
    const isAvailable = availableStock > 0;

    const checkboxHtml = isAvailable
      ? `<input type="checkbox" class="checkout-checkbox" value="${book.bookId}" data-title="${book.bookTitle}" style="height: 18px; width: 18px;">`
      : `<span class="badge bg-danger">Out of Stock</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center align-middle">${checkboxHtml}</td>
      <td class="align-middle">${book.bookTitle}</td>
      <td class="align-middle">${book.authorName}</td>
      <td class="align-middle">${book.publisherName}</td>
    `;
    tbody.appendChild(tr);
  });
}

function checkoutSelectedBooks(event) {
  event.preventDefault();

  const checkboxes = document.querySelectorAll(".checkout-checkbox:checked");
  if (checkboxes.length === 0) {
    alert("Please select at least one book to checkout.");
    return;
  }

  const currentStudentData = JSON.parse(localStorage.getItem("currentStudent"));
  let jsonObj = JSON.parse(localStorage.getItem("myStudents"));
  let studentIndex = jsonObj.students.findIndex(s => s.rollNo === currentStudentData.rollNo);

  if (studentIndex !== -1) {
    let student = jsonObj.students[studentIndex];
    
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); 

    const issueDateStr = today.toISOString().split('T')[0];
    const dueDateStr = dueDate.toISOString().split('T')[0];

    let checkedOutCount = 0;

    checkboxes.forEach(cb => {
      const bookId = cb.value;
      const title = cb.getAttribute("data-title");

      // Prevent borrowing the exact same book twice at the same time
      const alreadyHas = student.borrowingHistory.find(b => b.bookId === bookId && b.returnDate === null);
      if (alreadyHas) {
         alert(`You are already currently borrowing "${title}"!`);
         return; 
      }

      student.borrowingHistory.push({
        bookId: bookId,
        title: title,
        issuedDate: issueDateStr,
        dueDate: dueDateStr,
        returnDate: null
      });
      checkedOutCount++;
    });

    if (checkedOutCount > 0) {
      localStorage.setItem("myStudents", JSON.stringify(jsonObj));
      localStorage.setItem("currentStudent", JSON.stringify(student));
      alert(`Successfully checked out ${checkedOutCount} book(s)!`);
      window.location.href = "./returnBook.html";
    }
  }
}