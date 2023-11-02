document.addEventListener('DOMContentLoaded', () => {
    const Book = class {
            constructor(title, author, year, read) {
            this.title = title;
            this.author = author;
            this.year = year;
            this.read = read;
        }
    }

    let myLibrary = JSON.parse(sessionStorage.getItem('myLibrary'));
    if (!myLibrary) {
        myLibrary = [];
    }

    function addBookToLibrary(book) {
        myLibrary.push(book);
        sessionStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    }

    function switchSrc(item, src1, src2) {
        if (item.classList.contains('read')) {
            item.src = src2;
            item.classList.remove('read');
        } else {
            item.src = src1;
            item.classList.add('read');
        }
    }

    function cancelModal(modalContainer, content) {
        modalContainer.style.display = 'none';
        modalContainer.innerHTML = '';
        content.classList.remove('overlay');
    }

    function displayLibrary() {
        parentNode = document.querySelector('#libraryContainer');

        // Necessary for refreshes.
        parentNode.innerHTML = '';
        for (let i = 0; i < myLibrary.length; i++) {
            // The basic structure of any book div will be
            // <div class="bookCard">
            //     <div class="bookTitle">
            //         ...Text...
            //     </div>
            //     <div class="bookInfoContainer">
            //         <p class="bookInfo">...</p>
            //         <p class="bookInfo">...</p>
            //     </div>
            //     <div class="statusButton">
            //         <div class="challenge">Have you read it?</div>
            //         <img src='Red_x.png' alt='READ?' class="statusButtonImg" />
            //     </div>
            // </div>

            // Let's create everything first.
            childNode = document.createElement("div");
            childNode.className = 'bookCard';

            childTitle = document.createElement("div");
            childTitle.className = 'bookTitle';
            childTitle.innerHTML = myLibrary[i].title;

            childInfo = document.createElement("div");
            childInfo.className = 'bookInfoContainer';

            childInfoAuthor = document.createElement("p");
            childInfoAuthor.className = 'bookInfo';
            childInfoAuthor.innerHTML = myLibrary[i].author;

            childInfoYear = document.createElement("p");
            childInfoYear.className = 'bookInfo';
            childInfoYear.innerHTML = myLibrary[i].year;

            childStatus = document.createElement("div");
            childStatus.className = 'statusButton';
            
            childStatusChallenge = document.createElement("div");
            childStatusChallenge.innerHTML = 'Have you read it?';

            childStatusImg = document.createElement("img");
            childStatusImg.className = 'statusButtonImg';
            childStatusImg.src = 'Red_x.png';

            // I think this is everything. Let's append going outwards.
            childStatus.append(childStatusChallenge);
            childStatus.append(childStatusImg);

            childInfo.append(childInfoAuthor);
            childInfo.append(childInfoYear);

            childNode.append(childTitle);
            childNode.append(childInfo);
            childNode.append(childStatus);

            // And done.
            parentNode.append(childNode);
        }

        // Click listener for every tick.
        ticks = document.querySelectorAll('.statusButtonImg');
        ticks.forEach((item) => {
            item.addEventListener('click', () => {
                switchSrc(item, 'Green_tick.png', 'Red_x.png');
            })
        })
    }

    function startNewBook() {
        // Add overlay class to content div.
        content = document.querySelector('.content');
        content.classList.add('overlay');

        // Select modal container.
        modalContainer = document.querySelector('.modal');

        // Create modal.
        newBookModal = document.createElement('div');
        newBookModal.className += 'newBookModal';
        newBookModal.style = 'text-align: center;'

        // Descriptive field.
        modalTitle = document.createElement('h2');
        modalTitle.innerHTML = 'Add new book';
        newBookModal.append(modalTitle);

        // Let's create the input fields inside the modal.
        // Book title
        bookTitleText = document.createElement('h3');
        bookTitleText.innerHTML = 'Book title';
        bookTitleInput = document.createElement('input');
        bookTitleInput.className = 'newBookInput';
        bookTitleInput.required = true;

        newBookModal.append(bookTitleText);
        newBookModal.append(bookTitleInput);

        // Book author
        bookAuthorText = document.createElement('h3');
        bookAuthorText.innerHTML = 'Author';
        bookAuthorInput = document.createElement('input');
        bookAuthorInput.className = 'newBookInput';
        bookAuthorInput.required = true;

        newBookModal.append(bookAuthorText);
        newBookModal.append(bookAuthorInput);

        // Book year
        bookYearText = document.createElement('h3');
        bookYearText.innerHTML = 'Year of publishing';
        bookYearInput = document.createElement('input');
        bookYearInput.className = 'newBookInput';
        bookYearInput.required = true;

        newBookModal.append(bookYearText);
        newBookModal.append(bookYearInput);

        // In case everything goes well, add submit and cancel buttons.
        modalButtonContainer = document.createElement('div');
        modalButtonContainer.style = 'display: flex; justify-content: space-around; margin-top: 10px;'
        
        submitButton = document.createElement('button');
        submitButton.id = 'submitButton';
        submitButton.innerHTML = 'Submit';
        submitButton.classList.add('modalButton');
        modalButtonContainer.append(submitButton);

        cancelButton = document.createElement('button');
        cancelButton.id = 'cancelButton'
        cancelButton.innerHTML = 'Cancel';
        cancelButton.classList.add('modalButton');
        modalButtonContainer.append(cancelButton);

        newBookModal.append(modalButtonContainer);

        // Append the child node and display.
        modalContainer.append(newBookModal);
        modalContainer.style.display = 'block';

        // Outside click listener, for cancellation.
        content.addEventListener('mouseup', () => {
            cancelModal(modalContainer, content);
        })

        // Cancel button listener, exactly the same as 
        cancelButton = document.querySelector('#cancelButton');
        cancelButton.addEventListener('click', () => {
            cancelModal(modalContainer, content);
        })

        // Last case scenario, and happiest one: submit button listener.
        submitButton = document.querySelector('#submitButton');
        submitButton.addEventListener('click', () => {
            // Check if values are set in.
            title = bookTitleInput.value;
            author = bookAuthorInput.value;
            year = bookYearInput.value;

            // If any of the values are empty, do nothing.
            if (title == '' || author == '' || year == '') {
                return
            }

            // Else, create the new book.
            newBook = new Book(title, author, year, false);
            addBookToLibrary(newBook);
            // At the end, we still cancel the modal, but still.
            cancelModal(modalContainer, content);
            
            // And refresh the library.
            displayLibrary();
        })
    }

    displayLibrary();

    // Click listener for add button.
    addButton = document.querySelector('.addButton');
    addButton.addEventListener('click', () => {
        startNewBook();
    })
})