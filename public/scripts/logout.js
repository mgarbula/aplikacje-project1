const logout = document.getElementById('logout');
const logoutError = document.getElementById('logoutError');

logout.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok && data.success) {
            window.location.href = '/';
        } else {
            logoutError.textContent = data.error;
        }
    } catch (error) {
        console.error('Error during logout:', error);
        logoutError.textContent = 'Błąd wylogowania. Spróbuj ponownie.';
    }
});