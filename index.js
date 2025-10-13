// Array to be synced with localStorage
const myLibrary = [];

// Function to save in localStorage
const saveToLocalStorage = () => {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
};

// DOM elements for each book section
const currentlyReading = document.querySelector(".currentlyReading");
const nextUp = document.querySelector(".nextUp");
const finished = document.querySelector(".finished");

// Overlay element that shows/hides the add-book form
const hidden = document.querySelector(".hidden");

// Show overlay when "Add Book" button clicked
const addBtn = document.querySelector("#btn");
addBtn.addEventListener("click", () => {
    hidden.style.display = "flex";
});

// Hide overlay when exit button clicked
const exit = document.querySelector(".btnExit");
exit.addEventListener("click", () => {
    hidden.style.display = "none";
});

// Input fields
const name = document.querySelector("#name");
const author = document.querySelector("#author");
const pages = document.querySelector("#pages");
const img = document.querySelector("#img");
const form = document.querySelector("form");

// Book constructor
function Book(name, author, pages, read, img){  
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
    this.img = img;
}

// Add book to myLibrary
function addBookToLibrary(name, author, pages, read, img) {
    const newBook = new Book(name, author, pages, read, img);
    myLibrary.push(newBook);
    return newBook;
}

// Create DOM element for book
function NewBookAdd(book) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btnDelete");
    btnDelete.textContent = "Delete";
    btnDelete.addEventListener("click", () => {
        bookElement.remove();
        const index = myLibrary.findIndex(b => b.id === book.id);
        if (index !== -1) {
            myLibrary.splice(index, 1);
            saveToLocalStorage();
        }
    });

    const text = document.createElement("p");
    text.classList.add("text");
    text.textContent = `${book.author} — "${book.name}" (${book.pages} pages)`;

    const imgOverlay = document.createElement("div");
    imgOverlay.classList.add("imgOverlay");

    bookElement.appendChild(imgOverlay);
    bookElement.appendChild(text);
    bookElement.appendChild(btnDelete);

    bookElement.style.backgroundImage = `url("${book.img}")`;

    return bookElement;
}

// Status button
function addStatusButton(book, bookElement) {
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btnEdit");
    btnEdit.textContent = "Status";

    btnEdit.addEventListener("click", () => {
        if (book.read === "Currently Reading") {
            book.read = "Finished";
            finished.appendChild(bookElement);
        } else if (book.read === "Want to Read") {
            book.read = "Currently Reading";
            currentlyReading.appendChild(bookElement);
        } else {
            book.read = "Want to Read";
            nextUp.appendChild(bookElement);
        }
        saveToLocalStorage();
    });

    bookElement.appendChild(btnEdit);
}

// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Validate inputs
    if (!name.value.trim()) {
        name.setCustomValidity("Title is required");
        name.reportValidity();
        return;
    } else name.setCustomValidity("");

    if (!author.value.trim()) {
        author.setCustomValidity("Author is required");
        author.reportValidity();
        return;
    } else author.setCustomValidity("");

    if (!pages.value.trim()) {
        pages.setCustomValidity("Pages are required");
        pages.reportValidity();
        return;
    } else pages.setCustomValidity("");

    if (!img.value.trim()) {
        img.setCustomValidity("Image URL is required");
        img.reportValidity();
        return;
    } else img.setCustomValidity("");

    // Validate reading status
    const readInput = document.querySelector('input[name="read"]:checked');
    if (!readInput) {
        alert("Please select a reading status");
        return;
    }
    const read = readInput.value;

    // Create book and DOM element
    const newBook = addBookToLibrary(name.value, author.value, pages.value, read, img.value);
    const bookElement = NewBookAdd(newBook);

    // Append to correct section
    if (read === "Finished") finished.appendChild(bookElement);
    else if (read === "Currently Reading") currentlyReading.appendChild(bookElement);
    else nextUp.appendChild(bookElement);

    addStatusButton(newBook, bookElement);
    saveToLocalStorage();

    // Reset form and hide overlay
    form.reset();
    hidden.style.display = "none";
});

// Load books from localStorage
const storedBooks = JSON.parse(localStorage.getItem("myLibrary"));
if (storedBooks) {
    storedBooks.forEach(bookData => {
        const book = new Book(bookData.name, bookData.author, bookData.pages, bookData.read, bookData.img);
        book.id = bookData.id;
        myLibrary.push(book);

        const bookElement = NewBookAdd(book);
        addStatusButton(book, bookElement);

        if (book.read === "Finished") finished.appendChild(bookElement);
        else if (book.read === "Currently Reading") currentlyReading.appendChild(bookElement);
        else nextUp.appendChild(bookElement);
    });
}
