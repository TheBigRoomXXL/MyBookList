//Book class: reprensente un livre
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;

    }
}

//UI class: gère les tache UI
class UI
{
    static displayBooks()
    {
        const storedBooks = Storage.getBooks();

        const books = storedBooks;

        books.forEach((element) => UI.addBookToList(element));
    };

    static addBookToList(book)
    {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    };

    static ClearFields()
    {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(element)
    {
        //Storage.deleteBook()
        element.parentElement.parentElement.remove();
        UI.showAlert("Suppression réussie.","success")
    }

    static showAlert(message, className)
    {
        //create div alert
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        //insert div alert
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //autodelete  div alerte
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
}


//Store class: gère le stockage
class Storage{
    static getBooks()
    {
        let books;
        if(localStorage.getItem('books') === null)
        {
            books = [];
        }
        else
        {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book)
    {
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn)
    {
        const books = Storage.getBooks();
        books.forEach((book,index) =>
        {
            console.log("books.isnb :" + book.isbn);
            console.log("      isnb :" + isbn);
            if(book.isbn === isbn){console.log("match!");books.splice(index,1)}
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display book
document.addEventListener('DOMContentLoaded', UI.displayBooks());

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) =>
    {
        // Prevent actual submit (???)
        e.preventDefault();

        //Get values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        //Validate
        if(title === '' || author === '' || isbn === '')
        {
            UI.showAlert("Remplissez tout les champs du formulaire s'il vous plait.","danger")
        }
        else
        {
            //Instantiate au book
            const book = new Book(title, author, isbn);
            Storage.addBook(book);
            UI.addBookToList(book);

            //Clear fields & feedback
            UI.ClearFields()
            UI.showAlert("Ajout réussi.","success")
        }
    }
);

//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) =>
    {
        if(e.target.classList.contains('delete'))
        {
            console.log(e.target.parentElement.previousElementSibling.textContent);
            Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
            UI.deleteBook(e.target);
        };
    }
);
