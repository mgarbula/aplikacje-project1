import { request } from './helpers.js';

const editForm = document.getElementById('editAccount');
const editError = document.getElementById('editError');

const deleteButton = document.getElementById('delete');

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (
        username === '' ||
        email === '' ||
        name === '' ||
        surname === ''
    ) {
        editError.textContent = "Pola username, imię, nazwisko, email nie mogą być puste";
        return;
    }

    if (password !== confirmPassword) {
        editError.textContent = "Hasła nie są takie same.";
        return;
    }

    var password_hash;
    if (password === '') {
        password_hash = '';
    } else {
        var hashObj = new jsSHA("SHA-512", "TEXT", {numRoads: 1});
        hashObj.update(password);
        password_hash = hashObj.getHash("HEX");
    }

    const dataArray = [
        { key: 'username', value: username },
        { key: 'email', value: email },
        { key: 'name', value: name },
        { key: 'surname', value: surname },
        { key: 'password_hash', value: password_hash },
    ];

    request(
        dataArray,
        '/account',
        'PUT',
        '/account',
        'Error during editing account:',
        'Błąd edycji. Spróbuj ponownie',
        editError,
    );
});

deleteButton.addEventListener('click', async (event) => {
    event.preventDefault();
    
    request(
        [],
        '/account',
        'DELETE',
        '/',
        'Error during account deletion:',
        'Błąd usuwania. Spróbuj ponownie',
    );
});