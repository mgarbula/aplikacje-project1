import { request } from './helpers.js';

const registrationForm = document.getElementById('registrationForm');
const registrationError = document.getElementById('registrationError');

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        registrationError.textContent = "Hasła nie są takie same.";
        return;
    }

    var hashObj = new jsSHA("SHA-512", "TEXT", {numRoads: 1});
    hashObj.update(password);
    const password_hash = hashObj.getHash("HEX");

    const dataArray = [
        { key: 'username', value: username },
        { key: 'email', value: email },
        { key: 'name', value: name },
        { key: 'surname', value: surname },
        { key: 'password_hash', value: password_hash },
    ];

    request(
        dataArray,
        '/register',
        'POST',
        '/login',
        'Error during registration:',
        'Błąd rejestracji. Spróbuj ponownie.',
        registrationError,
    );
});