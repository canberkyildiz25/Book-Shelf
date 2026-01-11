import { all } from 'axios';
import { darkModal } from './modal.js';
import { lightModal } from './modal.js';

var modal = document.getElementById('login-modal');
var btn = document.getElementById('btn-sign-up');
var btnSignUp = document.querySelector('svg.btn-sign-up');
var span = document.getElementsByClassName('close-modal')[0];

var submitBtn = document.getElementsByClassName('submit-button')[0];
var btnHmbrgr = document.getElementsByClassName('hmbrgr')[0];

var btnToggleMode = document.querySelector(
  'div.right-container > a.switcher-2'
);
var mnuSignIn = document.querySelector('#window-sign-in');
var mnuSignUp = document.querySelector('#window-sign-up');
var btnUserProfile = document.querySelector('a#btn-sign-up');
var btnSignOut = document.querySelector('a#btn-sign-out');

const signUpClick = function () {
  modal.style.display = 'flex';
};

btn.addEventListener('click', signUpClick);

btnHmbrgr.addEventListener('click', btnHmbrgr.onclick);
submitBtn.addEventListener('click', signUp);

btnToggleMode.addEventListener('click', toggleMode);
mnuSignIn.addEventListener('click', mnuSignIn.onclick);
mnuSignUp.addEventListener('click', mnuSignUp.onclick);

btnSignOut.addEventListener('click', signOutCompletely);

btnHmbrgr.onclick = function () {
  modal.style.display = 'flex';
};
span.onclick = function () {
  modal.style.display = 'none';
};
window.onclick = function (event) {
  if (event.target == modal) modal.style.display = 'none';
};
mnuSignIn.onclick = function () {
  var inputUsername = document.querySelector('#username');
  var linkSignUp = document.querySelector('#window-sign-up');
  var linkSignIn = document.querySelector('#window-sign-in');
  var btnSignIn = document.querySelector('button.submit-button');

  inputUsername.style.display = 'none';
  linkSignUp.style.textDecoration = 'none';
  linkSignUp.style.color = '#111111';

  linkSignIn.style.textDecoration = 'underline';
  linkSignIn.style.color = 'var(--accent)';

  btnSignIn.textContent = 'SIGN IN';
};
mnuSignUp.onclick = function () {
  var inputUsername = document.querySelector('#username');
  var linkSignUp = document.querySelector('#window-sign-up');
  var linkSignIn = document.querySelector('#window-sign-in');
  var btnSignIn = document.querySelector('button.submit-button');

  inputUsername.style.display = '';
  linkSignUp.style.textDecoration = 'underline';
  linkSignUp.style.color = 'var(--accent)';

  linkSignIn.style.textDecoration = 'none';
  linkSignIn.style.color = '#111111';

  btnSignIn.textContent = 'SIGN UP';
};

function signUp() {
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var btnSignIn = document.querySelector('button.submit-button');
  var form = document.querySelector('form#sign-up-form');

  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (btnSignIn.textContent === 'SIGN UP') {
    if (!username || !email || !password) {
      alert('Please fill out all fields.');
      return;
    } else {
      // Add new user to the array
      users.push({ username, email, password });
      // Save updated users array back to LocalStorage
      localStorage.setItem('users', JSON.stringify(users));
      alert('Signup Successful!');
      modal.style.display = 'none';
      form.reset();
    }
  } else {
    const user = users.find(u => {
      return u.email === email;
    });

    if (user == undefined || user.password !== password) {
      alert('Password does not match or user does not exist!');
    } else {
      alert('Signin successful!');
      modal.style.display = 'none';
      btnSignUp.style.display = 'none';
      createUserProfile(user.username);
      btn.removeEventListener('click', signUpClick);
      btn.addEventListener('click', showLogOut);
      form.reset();
    }
  }
}
function toggleMode() {
  var svg = document.querySelector('svg.swicther-2-svg');
  var header = document.querySelector('header.header');
  var navLogoTxt = document.querySelector('svg.nav-logo-txt');
  var hmbrgrMenu = document.querySelector('svg.hmbrgr-menu');
  var shoppingLink = document.querySelector('a.nav-link.shopping-list');
  var shoppingIcon = document.querySelector('svg.lock-02');
  var body = document.querySelector('body');
  var ctgs = document.querySelectorAll('ul#categories > li.ctg');
  var title = document.querySelector('.top_list-title');
  var bookTitles = document.querySelectorAll('.top_list-book_title ');
  var seeMore = document.querySelectorAll('.top_list-see_more');
  //var allCats = document.querySelector('.all_categories');
  var signUpModal = document.querySelector('.modal-signUp');
  var signUpInputs = document.querySelectorAll('.login-form form input');
  var loginFormButton = document.querySelector('.login-form button');
  var modalWindows = document.querySelectorAll('div.modal-window > a');
  var closeModal = document.querySelector('div.close-modal');

  if (svg.innerHTML.includes(`Switcher-2@2x.svg#switcher2`)) {
    darkModal(); // Modal.js ten darkModal fonksiyonu çağırdım.
    svg.innerHTML = `<use href="img/SwitcherDark@2x.svg#switcherDark"></use>`;
    header.style.backgroundColor = 'var(--black)';
    header.style.border = ' 1.5px solid #FFFFFF';
    navLogoTxt.style.filter = 'brightness(0) invert(1)';
    hmbrgrMenu.style.filter = 'brightness(0) invert(1)';
    shoppingLink.style.color = 'var(--white)';
    shoppingIcon.style.filter = 'brightness(0) invert(1)';
    body.style.backgroundColor = 'var(--black)';
    body.classList.add('dark-mode');
    ctgs.forEach(elem => {
      elem.style.color = '#FFFFFF';
    });
    title.style.color = 'var(--white)';
    //allCats.style.color = 'var(--white)';
    bookTitles.forEach(e => {
      e.style.color = 'var(--white)';
    });
    seeMore.forEach(e => {
      e.style.color = 'var(--white)';
    });
    signUpModal.style.backgroundColor = 'var(--black)';
    signUpInputs.forEach(i => {
      i.style.backgroundColor = 'var(--black)';
      i.classList.add('dark-mode');
    });
    loginFormButton.style.backgroundColor = 'var(--white)';
    loginFormButton.style.color = 'var(--black)';
    modalWindows.forEach(mw => {
      mw.style.color = 'var(--white)';
    });
    closeModal.style.color = 'var(--white)';
  } else {
    lightModal(); // Modal.js ten lightmodal fonksiyonu çağırdım.
    svg.innerHTML = `<use href="img/Switcher-2@2x.svg#switcher2"></use>`;
    header.style.backgroundColor = 'var(--white)';
    header.style.border = ' 1.5px solid #111111';
    navLogoTxt.style.filter = '';
    hmbrgrMenu.style.filter = '';
    shoppingLink.style.color = 'var(--black)';
    shoppingIcon.style.filter = '';
    body.style.backgroundColor = 'var(--white)';
    body.classList.remove('dark-mode');
    ctgs.forEach(elem => {
      elem.style.color = '#111111';
    });
    title.style.color = 'var(--black)';
    //allCats.style.color = 'var(--black)';
    bookTitles.forEach(e => {
      e.style.color = 'var(--black)';
    });
    seeMore.forEach(e => {
      e.style.color = 'var(--black)';
    });
    signUpModal.style.backgroundColor = '#F6F6F6';
    signUpInputs.forEach(i => {
      i.style.backgroundColor = '#F6F6F6';
      i.classList.remove('dark-mode');
    });
    loginFormButton.style.backgroundColor = '#111111';
    loginFormButton.style.color = 'var(--white)';
    modalWindows.forEach(mw => {
      mw.style.color = 'var(--black)';
    });
    closeModal.style.color = 'var(--black)';
  }
}
function createUserProfile(username) {
  var markup = `<div class='signed-in'><img src='/img/Stephen.png' width=37 height= 37 alt='Stephen'/>
                    <p>${username}</p>
                    <svg class="sign-out btn-sign-out" width="23" height="26">
                       <use href="img/drop-down.svg#drop-down"></use>
                    </svg>
                </div>`;
  btnUserProfile.insertAdjacentHTML('beforeend', markup);
}
function showLogOut() {
  btnSignOut.style.display = 'block';
  btnSignOut.insertAdjacentElement('afterend', btnUserProfile);
}
function signOutCompletely() {
  btnSignOut.style.display = 'none';
  btnUserProfile.firstElementChild.style.display = 'flex';
  btnUserProfile.firstElementChild.nextElementSibling.style.display = 'none';
  btn.style.display = 'flex';
  btn.removeEventListener('click', showLogOut);
  btn.addEventListener('click', signUpClick);
}
