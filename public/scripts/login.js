const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    var hashObj = new jsSHA("SHA-512", "TEXT", {numRoads: 1});
    hashObj.update(password);
    const password_hash = hashObj.getHash("HEX");

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password_hash,
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            window.location.href = '/';
        } else {
            loginError.textContent = data.error;
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginError.textContent = 'Błąd logowania. Spróbuj ponownie.';
    }
});
