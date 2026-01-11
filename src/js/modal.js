// Modal elementlerini seç
const modal = document.getElementById('bookModal');
const closeModal = document.querySelector('.close');
const modalImage = document.querySelector('.modalImage');
const modalTitle = document.querySelector('.modalTitle');
const modalAuthor = document.querySelector('.modalAuthor');
const modalDescription = document.querySelector('.modalDescription');
const modalBuyLinks = document.querySelector('.modalBuyLinks');
const addToShoppingList = document.querySelector('.addToShoppingList');
const removeFromShoppingList = document.querySelector(
  '.removeFromShoppingList'
);

const feedbackDiv = document.querySelector('.feedback-div');
const feedbackText = document.querySelector('.feedback-text');
const modalContent = document.querySelector('.modal-content'); // modal classını değiştirdik
const close = document.querySelector('.close');

// LocalStorage'dan alışveriş listesini al
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
let currentBookId = null;

// Logo eşleştirme için bir nesne
const storeLogos = {
  Amazon: 'img/png/Amazon_logo.png',
  'Apple Books': 'img/png/apple-books.png',
  'Barnes and Noble': 'img/png/barnes-noblepng.png',
  'Books-A-Million': 'img/png//books-a-million.png',
  Bookshop: 'img/png/bookshop.png',
  IndieBound: 'img/png/indie-bound.png',
};

// Modalı açma fonksiyonu
export async function onOpenModal(bookId) {
  currentBookId = bookId;
  try {
    const bookData = await fetchBookDetails(bookId);
    if (bookData) {
      modalImage.src = bookData.book_image;
      modalTitle.textContent = bookData.title;
      modalAuthor.textContent = `Yazar: ${bookData.author}`;
      modalDescription.textContent =
        bookData.description || 'Açıklama mevcut değil.';

      modalBuyLinks.innerHTML = bookData.buy_links
        .map(link => {
          const logo = storeLogos[link.name] || './images/default-logo.png';
          return `<li><a href="${link.url}" target="_blank"><img src="${logo}" alt="${link.name}" style="width: 40px; height: auto; margin-right: 10px;"></a></li>`;
        })
        .join('');
    }
    updateButtonState(bookId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // arka planın kaydırılmasını önleme
    // Dark Mode açıksa darkmodu aktif et
    if (document.body.classList.contains('dark-mode')) {
      darkModal();
    }
  } catch (error) {
    console.error('Kitap bilgileri yüklenirken hata oluştu:', error);
  }
}

// Kitap bilgilerini API'den çekme fonksiyonu
async function fetchBookDetails(bookId) {
  try {
    const response = await fetch(
      `https://books-backend.p.goit.global/books/${bookId}`
    );
    if (!response.ok) throw new Error('Kitap bilgisi getirilemedi.');
    return await response.json();
  } catch (error) {
    console.error('API hatası:', error);
    return null;
  }
}

// Butonların durumunu güncelleme
function updateButtonState(bookId) {
  if (shoppingList.includes(bookId)) {
    addToShoppingList.style.display = 'none';
    removeFromShoppingList.style.display = 'block';
  } else {
    addToShoppingList.style.display = 'block';
    removeFromShoppingList.style.display = 'none';
  }
}

// Kitabı alışveriş listesine ekleme
addToShoppingList.addEventListener('click', () => {
  if (!shoppingList.includes(currentBookId)) {
    shoppingList.push(currentBookId);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }
  updateButtonState(currentBookId);
  feedbackDiv.style.display = 'block';
});

// Kitabı alışveriş listesinden çıkarma
removeFromShoppingList.addEventListener('click', () => {
  shoppingList = shoppingList.filter(id => id !== currentBookId);
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  updateButtonState(currentBookId);
  feedbackDiv.style.display = 'none';
});

// Modalı kapatma işlemi
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'visible'; // kayırma işlevi tekrar aktif
});

// Modal dışında bir yere tıklanınca kapatma
window.addEventListener('click', event => {
  if (event.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'visible'; // kayırma işlevi tekrar aktif
  }
});

// Esc Tuşu modal kapatma işlevi
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    modal.style.display = 'none';
    document.body.style.overflow = 'visible'; // kayırma işlevi tekrar aktif
  }
});

// Dark Mode Fonksiyonı
// DEvam et
export function darkModal() {
  modalContent.style.background = 'black';
  modalContent.style.color = 'white';
  modalContent.style.border = '1px solid white';
  modalTitle.style.color = 'white';
  modalAuthor.style.color = 'white';
  modalDescription.style.color = 'white';
  close.style.color = 'white';
  feedbackText.style.color = 'white';
  addToShoppingList.style.background = 'black';
  addToShoppingList.style.color = 'white';

  removeFromShoppingList.style.background = 'black';
  removeFromShoppingList.style.color = 'white';
}
export function lightModal() {
  modalContent.style.background = '';
  modalContent.style.color = '';
  modalContent.style.border = '';
  modalTitle.style.color = '';
  modalAuthor.style.color = '';
  modalDescription.style.color = '';
  close.style.color = '';
  feedbackText.style.color = '';
  addToShoppingList.style.background = '';
  addToShoppingList.style.color = '';
  removeFromShoppingList.style.background = '';
  removeFromShoppingList.style.color = '';
}
