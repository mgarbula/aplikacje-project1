const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
import { request } from './helpers.js';

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    var hashObj = new jsSHA("SHA-512", "TEXT", {numRoads: 1});
    hashObj.update(password);
    const password_hash = hashObj.getHash("HEX");

    const dataArray = [
        { key: 'username', value: username },
        { key: 'password_hash', value: password_hash },
    ];

    request(
        dataArray,
        '/login',
        'POST',
        '/',
        'Error during login:',
        'Błąd logowania. Spróbuj ponownie.',
        loginError,
    );
});
