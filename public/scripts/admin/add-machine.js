const addMachineForm = document.getElementById('addMachineForm');
const addMachineError = document.getElementById('addMachineError');

import { request } from "../helpers.js";

addMachineForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const serial_number = document.getElementById('serial_number').value;
    const description = document.getElementById('description').value;
    
    const dataArray = [
        { key: 'name', value: name },
        { key: 'serial_number', value: serial_number },
        { key: 'description', value: description },
    ];
    
    request(
        dataArray,
        '/add-machine',
        'POST',
        '/machines-management',
        'Error during adding machine',
        'Nie udało się dodać maszyny.',
        addMachineError,
    );
});