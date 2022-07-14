const bookArray = [];
const STORAGE_KEY = 'BOOK-DATA';
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', () =>{
    loadBookDataFromStorage();
    const submitForm = document.getElementById('inputBook');
    const submitSearch = document.getElementById('searchBook');

    submitForm.addEventListener('submit', (e) =>{
        e.preventDefault();
        addBook();
    });
    
    submitSearch.addEventListener('submit', (e) =>{
        e.preventDefault();
        searchBook();
    })
});

function searchBook(){
    const searchBookResult = []
    const searchingValue = document.getElementById('searchBookTitle').value;
    for(const book of bookArray){
        if(book.title.toLowerCase().includes(searchingValue.toLowerCase()))
            searchBookResult.push(book);
    }
    showBookSearchResult(searchBookResult);
}

function loadBookDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const book of data) {
            bookArray.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, () =>{
    const incompleteBooks = document.getElementById('incompleteBookshelfList');
    const completeBooks = document.getElementById('completeBookshelfList');
    incompleteBooks.innerHTML = '';
    completeBooks.innerHTML = '';
    
    for(const book of bookArray){
        const bookItem = makeBook(book)
        if(!book.isComplete)
            incompleteBooks.appendChild(bookItem);
        else
            completeBooks.appendChild(bookItem);
    }
});

function showBookSearchResult(arr){
    const incompleteBooks = document.getElementById('incompleteBookshelfList');
    const completeBooks = document.getElementById('completeBookshelfList');
    incompleteBooks.innerHTML = '';
    completeBooks.innerHTML = '';
    
    for(const book of arr){
        const bookItem = makeBook(book)
        if(!book.isComplete)
            incompleteBooks.appendChild(bookItem);
        else
            completeBooks.appendChild(bookItem);
    }
}

function saveDataToStorage(){
    if(isStorageExist()){
        const jsonString = JSON.stringify(bookArray);
        localStorage.setItem(STORAGE_KEY, jsonString);
    }
}

function addBook(){
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;
    const bookObj = generateBookObj(+new Date(), bookTitle, bookAuthor, bookYear, bookIsComplete);
    bookArray.push(bookObj);
    clearTextBox();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function makeBook(book){
    const textTitle = document.createElement('h3');
    textTitle.innerText = book.title;
    
    const writer = document.createElement('p');
    writer.innerText = book.author;
    const year = document.createElement('p');
    year.innerText = book.year;
    
    const article = document.createElement('article');
    article.classList.add('book_item');
    
    const actionDiv = document.createElement('div');
    const positiveBtn = document.createElement('button');
    const negativeBtn = document.createElement('button');
    
    positiveBtn.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    negativeBtn.innerText = 'Hapus buku';
    actionDiv.classList.add('action');
    positiveBtn.classList.add('green');
    negativeBtn.classList.add('red');
    
    positiveBtn.addEventListener('click', () =>{
        const bookItem = loadBookItemById(book.id);
        const bookIndex = findBookIndex(book.id);
        book.isComplete = bookItem.isComplete ? false : true;
        bookArray[bookIndex].isComplete = book.isComplete;

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDataToStorage();
    });

    negativeBtn.addEventListener('click', () =>{
        Swal.fire({
            title: 'Konfirmasi',
            text: "Apakah anda yakin untuk menghapus item ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya Hapus!'
            }).then((result) => {
                if (result.isConfirmed){
                    Swal.fire('Terhapus!', 'File telah berhasil terhapus', 'success')    
                    deleteBook(book.id);
                }
            });
    });

    actionDiv.append(positiveBtn, negativeBtn);
    article.append(textTitle, writer, year, actionDiv);
    return article;
}

function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    bookArray.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function clearTextBox(){
    const bookTitle = document.getElementById('inputBookTitle');
    const bookAuthor = document.getElementById('inputBookAuthor');
    const bookYear = document.getElementById('inputBookYear');
    const bookIsComplete = document.getElementById('inputBookIsComplete');
    bookTitle.value = '';
    bookAuthor.value = '';
    bookYear.value = '';
    bookIsComplete.checked = false;
}

function loadBookItemById(bookId){
    for(const item of bookArray){
        if(item.id === bookId)
            return item;
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in bookArray) {
        if (bookArray[index].id === bookId)
            return index;
    }
    return -1;
}

function generateBookObj(id, title, author, year, isComplete){
    return{id, title, author, year, isComplete }
}

function isStorageExist(){
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

