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

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                name,
                surname,
                password_hash,
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            window.location.href = '/login';
        } else {
            registrationError.textContent = data.error;
        }
    } catch (error) {
        console.error('Error during registration:', error);
        registrationError.textContent = 'Błąd rejestracji. Spróbuj ponownie.';
    }
});