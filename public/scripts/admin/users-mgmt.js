import { request } from "../helpers.js";

document.addEventListener('DOMContentLoaded', () => {
    const statusButtons = document.querySelectorAll('.change-permissions');

    statusButtons.forEach(button => {
        button.addEventListener('click', changePermissions);
    });

    function changePermissions(event) {
        const button = event.target;
        const userId = button.getAttribute('id');
        const row = button.closest('tr');
        const isAdminField = row.querySelector('.is-admin');

        const isAdmin = isAdminField.value;
        var changeAdmin = 0;
        if (isAdmin === "Zwykły user") {
            changeAdmin = 1;
        }


        const dataArray = [
            { key: 'id', value: userId },
            { key: 'is_admin', value: changeAdmin },
        ];

        request(
            dataArray,
            '/users-management',
            'PUT',
            '/users-management',
            'Error during user modification',
            'Błąd modyfikacji. Spróbuj ponownie',
        );
    }
});