// Array to be synced with localStorage
const myLibrary = [];

//function to save in localStorage
const saveToLocalStorage = function(){
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// DOM elements for each book section
const currentlyReading = document.querySelector(".currentlyReading"); 
const nextUp = document.querySelector(".nextUp");  
const finished = document.querySelector(".finished");  
// overlay element that shows/hides the add-book form
const hidden = document.querySelector(".hidden");

//Create the add and delete button
const addBtn = document.querySelector("#btn"); 
addBtn.addEventListener("click", function(){ // show overlay when button is clicked
    hidden.style.display = "flex";
})

const exit = document.querySelector(".btnExit");
exit.addEventListener("click", function(){
    hidden.style.display = "none";  // hide overlay
})

// Input fields for book details
const name = document.querySelector("#name"); 
const author = document.querySelector("#author");
const pages = document.querySelector("#pages");
const img = document.querySelector("#img");

// Book constructor
function Book(name, author, pages, read, img){  
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
    this.img = img;
}

// Create a Book object and add it to the array
function addBookToLibrary(name, author, pages, read, img){ 
    const newBook = new Book(name, author, pages, read, img);
    myLibrary.push(newBook);
    return newBook;
}

// Create a DOM element representing a book
const NewBookAdd = function(book) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const btnDelete = document.createElement('button');
    btnDelete.classList.add("btnDelete");
    btnDelete.textContent = `Delete`;
    btnDelete.addEventListener("click", function () {
        bookElement.remove();

        // Delete book from myLibrary[]
        const index = myLibrary.findIndex(b => b.id === book.id);
        if (index !== -1) {
            myLibrary.splice(index, 1);
            saveToLocalStorage();
        }
    });

    const text = document.createElement('p');
    text.classList.add('text');
    text.textContent = 
        `${book.author} — "${book.name}" (${book.pages} pages)`;

    const imgOverlay = document.createElement('div');
    imgOverlay.classList.add('imgOverlay');

    bookElement.appendChild(imgOverlay);
    bookElement.appendChild(text);
    bookElement.appendChild(btnDelete);

    bookElement.style.backgroundImage = `url("${book.img}")`;

    return bookElement;
};

//status button
function addStatusButton(book, bookElement) {
    const btnEdit = document.createElement('button');
    btnEdit.classList.add("btnEdit");
    btnEdit.textContent = `Status`;

    btnEdit.addEventListener("click", function(){
        if(book.read === 'Currently Reading'){
            book.read = 'Finished';
            finished.appendChild(bookElement);
        }
        else if(book.read === 'Want to Read'){
            book.read = 'Currently Reading';
            currentlyReading.appendChild(bookElement);
        } else {
            book.read = 'Want to Read';
            nextUp.appendChild(bookElement);
        }
        saveToLocalStorage();
    });

    bookElement.appendChild(btnEdit);
}


    // Handle book submission
const addBook = document.querySelector(".add");
addBook.addEventListener("click", function() {
    
    // Get the selected reading status from the form
    const read = document.querySelector('input[name="read"]:checked').value;

     // Create the Book object and its DOM representation
    const newBook = addBookToLibrary(name.value, author.value, pages.value, read, img.value);
    const bookElement = NewBookAdd(newBook);

    // Append book to the appropriate section
    if (read === "Finished") {  
        finished.appendChild(bookElement);
    } else if (read === "Currently Reading") {
        currentlyReading.appendChild(bookElement);
    } else {
        nextUp.appendChild(bookElement);
    }saveToLocalStorage(); 
    
addStatusButton(newBook, bookElement);

// Reset form and hide overlay
    const form = document.querySelector("form"); 
    const formReset = function(){
        form.reset();
    }
    formReset();
    
    hidden.style.display = "none";

    saveToLocalStorage();
});



const storedBooks = JSON.parse(localStorage.getItem("myLibrary"));
    if (storedBooks) {
storedBooks.forEach(bookData => {
    const book = new Book(bookData.name, bookData.author, bookData.pages, bookData.read, bookData.img);
    book.id = bookData.id;
    myLibrary.push(book);

    const bookElement = NewBookAdd(book);

    addStatusButton(book, bookElement);

    if (book.read === "Finished") {
        finished.appendChild(bookElement);
    } else if (book.read === "Currently Reading") {
        currentlyReading.appendChild(bookElement);
    } else {
        nextUp.appendChild(bookElement);
    }
});
    };


