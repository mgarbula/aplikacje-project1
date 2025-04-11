const reserveForm = document.getElementById('reserveForm');
const reserveError = document.getElementById('reserveError');
const selectFrom = document.getElementById('from');
const selectTo = document.getElementById('to');
import { request } from './helpers.js';

reserveForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const from = selectFrom.options[selectFrom.selectedIndex].text;
    const to = selectFrom.options[selectTo.selectedIndex].text;

    if (from >= to) {
        reserveError.textContent = "Wybrałeś zły zakres dat!";
    } else {
        const dataArray = [
            { key: 'from', value: from },
            { key: 'to', value: to },
        ];

        request(
            dataArray,
            window.location.href,
            'POST',
            window.location.href,
            'Error during reservation:',
            'Błąd rezerwacji. Spróbuj ponownie.',
            reserveError,
        );
    }
});