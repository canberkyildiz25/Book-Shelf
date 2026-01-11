import { getTopBooks, getBooksByCategory } from './booksAPI.js';
import { spinnerPlay, spinnerStop } from './spinner.js';
import { onOpenModal } from './modal.js';
import { showNoBooksAlert } from './warnings.js';

const references = {
  topListElem: document.querySelector('#topList'),
  categoryListElem: document.querySelector('#categoryList'),
  titleElement: document.querySelector('.top_list-title'),
  allCategoriesElement: document.querySelector('#categories'),
};

let noBooksAlertShow = false;

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', clickSeeMore); //See More butonuna tıklanınca ilgili kategoriye ait kitapları gösterir.
  document.addEventListener('click', clickByBook); //Bir kitap kartına tıklanınca detaylarını gösteren modal açar.
  document.addEventListener('click', clickByAllCategories); //Bir kategoriye tıklanınca bu kategorinin kitapları gösterir.
  window.addEventListener('scroll', scrollHandler); //Sayfanın en altına kaydırıldığında kategorinin boş olup olmadığını kontrol eder.
});

//En Çok Satanlar Listesini Getirme
document.addEventListener('DOMContentLoaded', async function () {
  spinnerPlay(references.titleElement);
  references.topListElem.innerHTML = '';
  const topListData = getTopBooks();
  const topList = await topListData;
  let html = '';
  topList.forEach(elem => {
    html += renderTopList(elem);
  });
  references.topListElem.innerHTML = html;
  spinnerStop();
});

//En Çok Satanlar Listesini Renderleme
function renderTopList(elem) {
  return `<li class="top_list-container">
            <h2 class="top_list-category_name">${elem.list_name}</h2>
            <ul class="top_list-cards">${renderBooks(elem.books)}</ul>
            <button class="top_list-see_more" data-category="${
              elem.list_name
            }">See More</button>
        </li>`;
}

//Kitap kartlarının oluşturulması (kapak, başlık ve yazar ismi)
function renderBooks(books) {
  let i = 1;

  const filteredBooks = books.filter(book => book.book_image);
  const booksToShow = [];

  for (let j = 0; j < filteredBooks.length; j++) {
    booksToShow.push(filteredBooks[j]);
  }

  while (booksToShow.length < 5) {
    booksToShow.push(filteredBooks[booksToShow.length % filteredBooks.length]);
  }

  const bookHtml = booksToShow
    .map(
      book =>
        `
        <li class="top_list-card" data-book-sequence-number="${i++}">
            <div class="top_list-book_cover_wrapper" data-bookid="${book._id}">
                <img class="top_list-book_cover" src="${
                  book.book_image
                }" alt="${book.title}">
            <p class="top_list-quick">QUICK VIEW</p>
                </div>
            
            <h3 class="top_list-book_title">${book.title}</h3>
            <p class="top_list-book_author">${book.author}</p>
        </li>
        `
    )
    .join('');
  i++;
  return bookHtml;
}

const clickByBook = function (event) {
  const bookWrapper = event.target.closest('.top_list-book_cover_wrapper');
  if (bookWrapper) {
    const bookId = bookWrapper.dataset.bookid;
    onOpenModal(bookId); //Kitap ID' si ile birlikte modal açma fonksiyonunu çalıştırır.
  }
};

const clickSeeMore = function (event) {
  if (event.target.classList.contains('top_list-see_more')) {
    references.topListElem.classList.add('hidden'); //Üst kısımdaki kitap listesi gizlenir.
    references.categoryListElem.classList.remove('hidden'); //Kategorilerin bulunduğu liste alanı gösterilir.
    const category = event.target.dataset.category;
    titleCategory(category); //Seçilen kategorinin başlığını değiştirir.
    categoryList(category); //Seçilen kategoriye ait kitapları getirip listeler.
    allCategoriesActive(category); //Seçilen kategoriyi aktif hale getirir. Görsel vurgulama ekler.
  }
};

const clickByAllCategories = async function (event) {
  if (event.target.classList.contains('all-categories')) {
    //All Kategories butonuna tıklandığında;
    references.titleElement.innerHTML = 'Best Sellers <span>Books</span>';
    references.categoryListElem.classList.add('hidden');
    references.topListElem.classList.remove('hidden');
    allCategoriesActive('All categories');
  }
  if (event.target.classList.contains('sideCat')) {
    //Kategori listesine (bağlantısına) tıklandığında;
    const category = event.target.textContent.trim();
    titleCategory(category);
    references.categoryListElem.classList.remove('hidden');
    references.topListElem.classList.add('hidden');
    allCategoriesActive(category);
    await categoryList(category); //Seçilen kategoriye ait kitapları getirir.

    spinnerPlay(references.categoryListElem);
    try {
      await categoryList(category);
    } finally {
      spinnerStop();
    }
  }
};

//Kategoriye Ait Kitapların Listesini Getirme
async function categoryList(category) {
  try {
    spinnerPlay(references.titleElement);
    references.categoryListElem.innerHTML = '';

    const categoryData = await getBooksByCategory(category);
    let html = '';

    categoryData.forEach(book => {
      if (book.book_image) {
        html += `
          <li class="category_list-card">
              <div class="top_list-book_cover_wrapper" data-bookid="${book._id}">
                  <img class="top_list-book_cover" src="${book.book_image}" alt="${book.title}">
              </div>
              <h3 class="top_list-book_title">${book.title}</h3>
              <p class="top_list-book_author">${book.author}</p>
          </li>
          `;
      }
    });

    html += `<p class="all_categories"</p>`;
    references.categoryListElem.innerHTML = html;
  } catch (error) {
    console.error('Kategori verisi alınırken hata oluştu:', error);
    references.categoryListElem.innerHTML =
      '<p>Kitaplar yüklenirken bir hata oluştu.</p>';
  } finally {
    spinnerStop();
  }
}

//Seçilen kategori adını sayfa başlığı olarak gösterir.
function titleCategory(category) {
  references.titleElement.innerHTML = '';

  const words = category.split(' ');
  if (words.length === 1) {
    references.titleElement.textContent = category;
    return;
  }

  const lastWord = words.pop();
  references.titleElement.textContent = words.join(' ');

  const spanElement = document.createElement('span');
  spanElement.textContent = ' ' + lastWord;
  references.titleElement.appendChild(spanElement);
}

//Seçilen kategori aktif olur.
function allCategoriesActive(category) {
  const categories = document.querySelectorAll('.ctg'); // Tüm kategori bağlantılarını seçer.

  categories.forEach(link => {
    if (link.textContent.trim().toLowerCase() === category.toLowerCase()) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

//Sayfa en alta kaydırıldığında seçilen kategoriye ait kitap yoksa bu kategoride kitap bulunmamaktadır uyarısı verir.
function scrollHandler() {
  const endCategories = document.querySelector('.all_categories');
  if (endCategories) {
    const endCatPosition = endCategories.getBoundingClientRect(); //Konum alınır.
    const windowHeight = window.innerHeight; //Kullanıcının görünür pencere yükseliğini alır.

    if (
      endCatPosition.top < windowHeight &&
      !noBooksAlertShow &&
      references.topListElem.classList.contains('hidden')
    ) {
      showNoBooksAlert();
      noBooksAlertShow = true;
    }
  }
}

//Sayfanın en alta gelip gelmediğini kontrol eder ve uyarı mesajı gösterir.
let scrollTimeout;

window.addEventListener('scroll', function () {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(function () {
    scrollHandler();
  }, 300);
});

//Scroll Up Butonu
const scrollTopBtn = document.getElementById('scrollToTopBtn');
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;

scrollTopBtn.addEventListener('click', onScrollBtnClick);
window.addEventListener('scroll', onScroll);

function onScroll() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById('scrollToTopBtn').style.display = 'block';
    scrollTopBtn.classList.remove('btnHidden');
  } else {
    document.getElementById('scrollToTopBtn').style.display = 'none';
  }
}

function onScrollBtnClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
