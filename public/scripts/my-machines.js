import { request } from "./helpers.js";

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-reservation');

    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteReservation);
    });

    function deleteReservation(event) {
        const button = event.target;
        const resId = button.getAttribute('resId');
        const dataArray = [
            { key: "id", value: resId },
        ];

        request(
            dataArray,
            '/my-machines',
            'DELETE',
            '/my-machines',
            'Error during reservation deletion:',
            'Błąd usuwania. Spróbuj ponownie.'
        );
    }
});