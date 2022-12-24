import '@babel/polyfill';
import { login, logout } from './login';
import { register } from './register';

const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');

const registerForm = document.querySelector('.form--register');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const reg_name = document.getElementById('reg_name').value;
    const reg_email = document.getElementById('reg_email').value;
    const reg_password = document.getElementById('reg_password').value;
    const reg_password_confirm = document.getElementById('reg_password_confirm').value;

    const formData = {
      "name": reg_name,
      "email":reg_email,
      "password":reg_password,
      "passwordConfirm":reg_password_confirm,
      "role": "user"
    }
    register(formData);
  });
}