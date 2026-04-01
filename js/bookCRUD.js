// Initialize books database if it doesn't exist
async function initializeBooks() {
  if (!localStorage.getItem("myBooks")) {
    try {
      const response = await fetch("../../books.json");
      const jsonObj = await response.json();
      localStorage.setItem("myBooks", JSON.stringify(jsonObj));
    } catch (error) {
      console.error("Failed to fetch books.json", error);
      // Fallback to empty array if the fetch fails
      localStorage.setItem("myBooks", JSON.stringify({ books: [] }));
    }
  }
}

function manageBranch(branchName) {
  localStorage.setItem("selectedBranch", branchName);
  window.location.href = "editbookCopies.html";
}

//Loads books specific to the selected branch
async function loadBranchBooks() {
  await initializeBooks();
  const branch = localStorage.getItem("selectedBranch");
  
  if (!branch) {
    window.location.href = "libBranchesList.html";
    return;
  }
  
  document.getElementById("branchTitle").innerText = `Manage Books: ${branch}`;

  const jsonObj = JSON.parse(localStorage.getItem("myBooks"));
  const studentsObj = JSON.parse(localStorage.getItem("myStudents")) || { students: [] };

  const branchBooks = jsonObj.books.filter(b => b.branch === branch);
  const tbody = document.getElementById("booksTableBody");
  tbody.innerHTML = "";

  if (branchBooks.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7' class='text-center'>No books found for this branch. Add one below!</td></tr>";
    return;
  }

  branchBooks.forEach(book => {
    // Stock Calculation
    let borrowedCount = 0;
    studentsObj.students.forEach(student => {
      student.borrowingHistory.forEach(history => {
        if (history.bookId === book.bookId && history.returnDate === null) {
          borrowedCount++;
        }
      });
    });

    const availableStock = book.totalCopies - borrowedCount;
    const stockClass = availableStock > 0 ? "text-success" : "text-danger";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="align-middle">${book.bookId}</td>
      <td class="align-middle">${book.bookTitle}</td>
      <td class="align-middle">${book.authorName}</td>
      <td class="align-middle">${book.publisherName}</td>
      <td class="align-middle text-center">${book.totalCopies}</td>
      <td class="${stockClass} fw-bold text-center align-middle">${availableStock}</td>
      <td class="table_buttons text-center align-middle">
        <a class="edit" href="#bookFormCard" onclick="editBook('${book.bookId}')" title="Edit Book">
          <button class="btn btn-outline-warning"><i class="material-icons">edit</i></button>
        </a>
      </td>
      <td class="table_buttons text-center align-middle">
        <a class="delete" href="#" onclick="deleteBook('${book.bookId}')" title="Delete Book">
          <button class="btn btn-outline-danger"><i class="material-icons">delete</i></button>
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


function openAddModal() {
  document.getElementById("bookForm").reset();
  document.getElementById("isEditing").value = "false";
  document.getElementById("bookId").readOnly = false;
  document.getElementById("formSubmitBtn").innerText = "Add Book";
  document.getElementById("formTitle").innerText = "Add New Book";
  
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('bookModal'));
  modal.show();
}

//Handles Add / Update Form Submission
function saveBook(event) {
  event.preventDefault();
  
  const branch = localStorage.getItem("selectedBranch");
  const bookId = document.getElementById("bookId").value;
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const publisher = document.getElementById("bookPublisher").value;
  const copies = parseInt(document.getElementById("bookCopies").value);
  const isEditing = document.getElementById("isEditing").value; 

  let jsonObj = JSON.parse(localStorage.getItem("myBooks"));

  if (isEditing === "true") {
    const bookIndex = jsonObj.books.findIndex(b => b.bookId === bookId && b.branch === branch);
    if (bookIndex !== -1) {
      jsonObj.books[bookIndex].bookTitle = title;
      jsonObj.books[bookIndex].authorName = author;
      jsonObj.books[bookIndex].publisherName = publisher;
      jsonObj.books[bookIndex].totalCopies = copies;
      alert("Book updated successfully!");
    }
  } else {
    const exists = jsonObj.books.find(b => b.bookId === bookId);
    if (exists) {
      alert("A book with this ID already exists in the system!");
      return;
    }
    jsonObj.books.push({
      bookId: bookId,
      bookTitle: title,
      authorName: author,
      publisherName: publisher,
      branch: branch,
      totalCopies: copies
    });
    alert("Book added successfully!");
  }

  localStorage.setItem("myBooks", JSON.stringify(jsonObj));
  
  const modal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
  if (modal) {
    modal.hide();
  }
  cancelEdit();
  loadBranchBooks();
}
function editBook(targetId) {
  const branch = localStorage.getItem("selectedBranch");
  const jsonObj = JSON.parse(localStorage.getItem("myBooks"));
  const book = jsonObj.books.find(b => b.bookId === targetId && b.branch === branch);

  if (book) {
    document.getElementById("bookId").value = book.bookId;
    document.getElementById("bookId").readOnly = true; 
    document.getElementById("bookTitle").value = book.bookTitle;
    document.getElementById("bookAuthor").value = book.authorName;
    document.getElementById("bookPublisher").value = book.publisherName;
    document.getElementById("bookCopies").value = book.totalCopies;
    
    document.getElementById("isEditing").value = "true";
    document.getElementById("formSubmitBtn").innerText = "Update Book";
    document.getElementById("formTitle").innerText = "Edit Book Information";
    
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('bookModal'));
    modal.show();
  }
}

function deleteBook(targetId) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  const branch = localStorage.getItem("selectedBranch");
  let jsonObj = JSON.parse(localStorage.getItem("myBooks"));
  
  jsonObj.books = jsonObj.books.filter(b => !(b.bookId === targetId && b.branch === branch));
  
  localStorage.setItem("myBooks", JSON.stringify(jsonObj));
  loadBranchBooks();
}

function cancelEdit() {
  document.getElementById("bookForm").reset();
  document.getElementById("isEditing").value = "false";
  document.getElementById("bookId").readOnly = false;
  document.getElementById("formSubmitBtn").innerText = "Add Book";
  document.getElementById("formTitle").innerText = "Add New Book";
}
