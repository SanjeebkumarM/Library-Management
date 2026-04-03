# Library Management System

A modern, frontend-only Library Management System (Minor Project) built for Sundargarh Engineering School as a partial requirement for the diploma of Computer Science & Engg. 
This application provides a seamless experience for both Librarians (Admins) and Students to manage book inventories, track borrowing histories, and handle checkouts without the need for a backend database.

##

### Live Demo
*https://sanjeebkumarm.github.io/Library-Management/*



## Our Team
This project was developed by:
* **Sanjeeb Munda**
* **Muna Sahu**
* **Paban Barik**
* **Abhijit Kesari**
* **Rohit Kumar Pal**

## Internal Guide
* **Ms. Suprava Dash**

##

## Features

### Librarian (Admin) Module
* **Dynamic Inventory Management:** Add, edit, or delete books across different engineering branches (CSE, CIVIL, MECH, ELE, ETC).
* **Smart Stock Calculation:** Available stock automatically updates when students check out or return books.
* **Student Management:** Register new students directly from the dashboard.
* **Borrowing History Tracking:** View which books a student has borrowed, their due dates, and mark "Return Pending" books as officially returned.

### Student Module
* **Branch-Specific Catalogs:** Students can filter the library catalog by their engineering branch.
* **Smart Checkout System:** Prevents checking out out-of-stock books and prevents borrowing the same book twice simultaneously. Automatically calculates 14-day due dates ( Can be changed in the javascript ).
* **Return Workflow:** Students can mark books as "Return Pending" from their dashboard, which alerts the librarian to finalize the return.

### UI/UX Highlights
* **Glassmorphism Design:** Beautiful "frosted glass" tables and modals with blurred, semi-transparent backgrounds.
* **Fully Responsive:** Optimized for both desktop and mobile viewing.
* **No Page Reloads for Modals:** Utilizes Bootstrap 5 Vanilla JavaScript for smooth, instantaneous pop-ups.

##

## Technologies Used

* **HTML5 & CSS3**
* **JavaScript (Vanilla/ES6):** Handles all logic, state management, and DOM manipulation.
* **Bootstrap 5:** For responsive layouts, grid systems, and native JavaScript components (Dropdowns, Modals).
* **Bootstrap Icons & Google Material Icons**
* **Local Storage API:** Simulates a persistent database on the client side.

##

## How the Data Works (No Backend Required)

This project relies completely on the browser's `localStorage` to simulate CRUD (Create, Read, Update, Delete) operations. 

1. On the very first load, the app fetches default data from local JSON files (`books.json`, `students.json`, `librarians.json`).
2. This data is saved into the browser's `localStorage`.
3. All subsequent additions, checkouts, and edits manipulate the `localStorage` arrays, allowing the app to act like it has a real, persistent database as long as the browser cache isn't cleared.

##

## How to Run Locally

Because this project uses the Javascript `fetch()` API to load the initial `.json` files, **it cannot be run by simply double-clicking the `index.html` file** (browsers block local file fetching for security reasons). 

You must run it through a local server:

**Using VS Code:**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Open the project folder in VS Code.
3. Right-click on `index.html` and select **"Open with Live Server"**.

**Using Python:**
1. Open your terminal/command prompt in the project folder.
2. Run `python -m http.server 8000` (or `python3`).
3. Open your browser and go to `http://localhost:8000`.

##

## Default Login Credentials

If you are running the project for the first time, use these credentials to log in:

**Librarian / Admin:**
* **Username:** `admin`
* **Password:** `123`

**Student:**
* **Roll No:** `CSE-24028`
* **Password:** `1234`

##

## Project Structure

```text
├── assets/             # Logos and background images
├── css/                # Custom stylesheets (index.css, style.css)
├── html/
│   ├── librarian/      # Admin dashboard, student lists, inventory management
│   └── student/        # Student dashboard, checkout, returning books
├── js/                 # Vanilla JS logic (CRUD operations, auth, dynamic tables)
├── books.json          # Initial default library inventory
├── librarians.json     # Initial default admin credentials
├── students.json       # Initial default student credentials & history
└── index.html          # Entry point (Redirects to homepage)
