const myLibrary = [];


// DOM elements for each book section
const currentlyReading = document.querySelector(".currentlyReading"); 
const nextUp = document.querySelector(".nextUp");  
const finished = document.querySelector(".finished");  

const hidden = document.querySelector(".hidden"); // overlay element that shows/hides the add-book form

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
function Book(name, author, pages, read){  
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
}

// Create a DOM element representing a book
const NewBookAdd = function(){        
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const btnDelete = document.createElement('button'); // Delete button for the book
    btnDelete.classList.add("btnDelete");
    btnDelete.textContent = `Delete`;
     btnDelete.addEventListener("click", function () {  // Remove book element from DOM on delete
        bookElement.remove();
    });

    const text = document.createElement('p');
    text.classList.add('text');
    text.textContent = 
    `${author.value} — 
     "${name.value}" 
     (${pages.value} pages)`; // Set book text content

     const imgOverlay = document.createElement('div');
     imgOverlay.classList.add('imgOverlay');

    bookElement.appendChild(imgOverlay);
    bookElement.appendChild(text);
    bookElement.appendChild(btnDelete); 

    bookElement.style.backgroundImage = `url("${img.value}")`;

    return bookElement; 
    };

    // Handle book submission
const addBook = document.querySelector(".add");
addBook.addEventListener("click", function() {
    
    // Create a Book object and add it to the array
function addBookToLibrary(name, author, pages, read){ 
    const newBook = new Book(name, author, pages, read);
    myLibrary.push(newBook);
    return newBook;
}

    // Get the selected reading status from the form
    const read = document.querySelector('input[name="read"]:checked').value;

     // Create the Book object and its DOM representation
    const newBook = addBookToLibrary(name.value, author.value, pages.value, read);
    const bookElement = NewBookAdd();

    // Append book to the appropriate section
    if (read === "Finished") {  
        finished.appendChild(bookElement);
    } else if (read === "Currently Reading") {
        currentlyReading.appendChild(bookElement);
    } else {
        nextUp.appendChild(bookElement);
    }

    // Edit button for the book
const btnEdit = document.createElement('button');
btnEdit.classList.add("btnEdit");
btnEdit.textContent = `Status`;
    btnEdit.addEventListener("click", function(){
    if(newBook.read === 'Currently Reading'){
        newBook.read = 'Finished';
        finished.appendChild(bookElement);
    }
    else if(newBook.read === 'Want to Read'){
        newBook.read = 'Currently Reading';
        currentlyReading.appendChild(bookElement);
    } else {
        newBook.read = 'Want to Read';
        nextUp.appendChild(bookElement);
    }
});

bookElement.appendChild(btnEdit); 

// Reset form and hide overlay
    const form = document.querySelector("form"); 
    const formReset = function(){
        form.reset();
    }
    formReset();
    
    hidden.style.display = "none";
});



