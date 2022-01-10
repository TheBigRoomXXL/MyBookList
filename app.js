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
        <td><a href="#" class="btn btn-danger btn-sm delete">Supprimer</a>  
        <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#myModal" onclick="editLine(this)"">Editer</button></td>
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
        element.parentElement.parentElement.remove();
        UI.showAlert("Suppression réussie.","success")
    }

    static updateBooks()
    {
        document.querySelector("#book-list").innerHTML = "";
        UI.displayBooks();

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
            if(book.isbn === isbn){console.log("match!");books.splice(index,1)}
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

    static editBook(isbn,title,author)
    {
        const books = Storage.getBooks();
        books.forEach((book,index) =>
        {
            if(book.isbn === isbn)
            {
                books[index] = new Book(title, author, isbn);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display book
document.addEventListener('DOMContentLoaded', UI.displayBooks());

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) =>
    {
        // Prevent actual submit 
        e.preventDefault();

        //Get values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        //Validate
        const books = Storage.getBooks();
        let isbnNotUnique = false;
        books.forEach((book) =>
        {
            if(book.isbn === isbn)
            {
                isbnNotUnique = true
            }
        });
        if(title === '' || author === '' || isbn === '')
        {
            UI.showAlert("Remplissez tout les champs du formulaire s'il vous plait.","danger")
        }
        else if(!(isbn.length == 10 || isbn.length == 13)) 
        {
            UI.showAlert("L'ISBN doit faire 10 ou 13 caractères","danger")
        }
        else if (isbnNotUnique) 
        {
            UI.showAlert("L'ISBN doit être unique dans la liste","danger")
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
            Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
            UI.deleteBook(e.target);
        };
    }
);

//Event: click on edit button
function editLine(e)
{
    //get data
    let isbn = e.parentElement.previousElementSibling.textContent;
    let auteur = e.parentElement.previousElementSibling.previousElementSibling.textContent;
    let titre = e.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

    //print data
    document.getElementById('title-edit').value = titre;
    document.getElementById('author-edit').value = auteur;
    document.getElementById('isbn-edit').value = isbn;
    document.getElementById('author-edit').value = auteur;

}

//Event: edit a book
document.querySelector('#book-form-edit').addEventListener('submit', (e) =>
    {
        // Prevent actual submit 
        e.preventDefault();

        //Get values
        const title = document.querySelector('#title-edit').value;
        const author = document.querySelector('#author-edit').value;
        const isbn = document.querySelector('#isbn-edit').value;

        //Validate
        if(title === '' || author === '' || isbn === '')
        {
            UI.showAlert("Remplissez tout les champs du formulaire s'il vous plait.","danger")
        }
        else if(!(isbn.length == 10 || isbn.length == 13)) 
        {
            UI.showAlert("L'ISBN doit faire 10 ou 13 caractères","danger")
        }
        else
        {
            //edit book in storage
            Storage.editBook(isbn,title,author)
            UI.updateBooks()

            //Clear modale
            var myModal = new bootstrap.Modal(document.getElementById('myModal'))
            console.log(myModal)
            myModal.hide()
        }
    }
);

