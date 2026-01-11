import { getBookByIds } from './booksAPI.js';
let savedBooks = JSON.parse(localStorage.getItem('shoppingList')) || [];

const booksContainer = document.getElementById('book-container');
const emptyListMessage = document.querySelector('.empty-list');
const amazonLink = {
  Amazon1: 'img/amazon.svg',
  Amazon2: 'img/amazon-dark.svg',
};

let booksPerPage = 4; // her sayfada 4 kitap
let currentPage = 1;

async function fetchBooks() {
  if (savedBooks.length === 0) {
    emptyListMessage.style.display = 'block';
    booksContainer.innerHTML = '';
    renderPagination();
    return;
  } else {
    emptyListMessage.style.display = 'none';
  }
  booksContainer.innerHTML = '';
  const validBookIds = savedBooks.filter(
    id => id !== null && id !== undefined && id !== ''
  );
  if (validBookIds.length === 0) {
    emptyListMessage.style.display = 'block';
    booksContainer.innerHTML = '';
    renderPagination();
    return;
  }
  try {
    const books = await getBookByIds(validBookIds);
    displayBooks(books);
    renderPagination();
  } catch (error) {
    console.error('Error', error);
  }
}
function displayBooks(books) {
  booksContainer.innerHTML = '';
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToShow = books.slice(startIndex, endIndex);
  booksToShow.forEach((book, index) => {
    const title = (book.title || '').toString().trim() || 'İsimsiz kitap';
    const author = (book.author || '').toString().trim() || 'Bilinmeyen yazar';
    const category = (book.list_name || '').toString().trim() || '';
    const description =
      (book.description || '').toString().trim() || 'Açıklama mevcut değil.';

    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.setAttribute('data-index', index + 1);
    bookCard.innerHTML = `
      <img src="${book.book_image}" alt="${title}" class="book-cover">
      <div class="book-info">
        <button class="delete-btn" data-id="${book._id}">&#128465;</button>
        <h3>${title}</h3>
        <p class="category">${category}</p>
        <p class="description">${description}</p>
        <p class="author">${author}</p>    
        <a href="${book.buy_links[0].url}" target="_blank" class="buy-button"><img src="${amazonLink.Amazon1}"  alt="icon" class="amazon-icon"></a>
        <a href="${book.buy_links[0].url}" target="_blank" class="buy-button"><img src="${amazonLink.Amazon2}"  alt="icon" class="amazon-icon-dark"></a>
      </div>
    `;
    booksContainer.appendChild(bookCard);
  });
}
function renderPagination() {
  const totalPages = Math.ceil(savedBooks.length / booksPerPage); // total page sayısını gsöterir
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return; // eğer sadece 1 sayfa varsa paginatonu göstermez
  // first page
  paginationContainer.innerHTML += `
    <button class="pagination-btn first-page" ${
      currentPage === 1 ? 'disabled' : ''
    }>⏮</button>
  `;
  // prev page
  paginationContainer.innerHTML += `
    <button class="pagination-btn prev-page" ${
      currentPage === 1 ? 'disabled' : ''
    }>◀</button>
  `;
  // page numbers
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    paginationContainer.innerHTML += `
      <button class="pagination-btn page-number ${
        i === currentPage ? 'active' : ''
      }" data-page="${i}">${i}</button>
    `;
  }
  // next page
  paginationContainer.innerHTML += `
    <button class="pagination-btn next-page" ${
      currentPage === totalPages ? 'disabled' : ''
    }>▶</button>
  `;
  // last page
  paginationContainer.innerHTML += `
    <button class="pagination-btn last-page" ${
      currentPage === totalPages ? 'disabled' : ''
    }>⏭</button>
  `;
}
// pagination click event
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('page-number')) {
    currentPage = parseInt(event.target.dataset.page);
    fetchBooks();
  } else if (event.target.classList.contains('first-page')) {
    currentPage = 1;
    fetchBooks();
  } else if (event.target.classList.contains('prev-page')) {
    if (currentPage > 1) {
      currentPage--;
      fetchBooks();
    }
  } else if (event.target.classList.contains('next-page')) {
    if (currentPage < Math.ceil(savedBooks.length / booksPerPage)) {
      currentPage++;
      fetchBooks();
    }
  } else if (event.target.classList.contains('last-page')) {
    currentPage = Math.ceil(savedBooks.length / booksPerPage);
    fetchBooks();
  }
});
document.addEventListener('DOMContentLoaded', fetchBooks);
// this is for delete book
document
  .getElementById('book-container')
  .addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
      const bookId = event.target.dataset.id;
      savedBooks = savedBooks.filter(id => id !== bookId);
      updateShoppingList(savedBooks);
      fetchBooks();
    }
  });
// update the localstorage
function updateShoppingList(updatedBooks) {
  localStorage.setItem('shoppingList', JSON.stringify(updatedBooks));
}
