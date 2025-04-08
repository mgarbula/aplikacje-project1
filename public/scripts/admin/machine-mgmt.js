import { request } from "../helpers.js";

const machineMgmtButton = document.getElementById('addMachine');

machineMgmtButton.addEventListener('click', () => {
    window.location.href = 'add-machine';
});

document.addEventListener('DOMContentLoaded', () => {
    const modifyButtons = document.querySelectorAll('.modify-button');
    const deleteButtons = document.querySelectorAll('.delete-button');

    modifyButtons.forEach(button => {
        button.addEventListener('click', modifyMachine);
    });

    // deleteButtons.forEach(button => {
    //     button.addEventListener('click', deleteMachine);
    // });

    function modifyMachine(event) {
        const button = event.target;
        const machineId = button.getAttribute("machineId");
        const row = button.closest('tr');
        const nameInput = row.querySelector('.machine-name');
        const srlInput = row.querySelector('.machine-srl');
        const dscrInput = row.querySelector('.machine-dscr');

        const name = nameInput.value;
        const srl = srlInput.value;
        const dscr = dscrInput.value;

        const dataArray = [
            { key: 'id', value: machineId },
            { key: 'name', value: name },
            { key: 'serial_number', value: srl },
            { key: 'description', value: dscr },
        ];

        request(
            dataArray,
            'modify-machine',
            'PUT',
            '/machines-management',
            'Error during modification:',
            'Błąd modyfikacji. Spróbuj ponownie.'
        );

        // console.log(`machine ID: ${machineId}`);
        // console.log(`name = ${name}, srl = ${srl}, dscr = ${dscr}`);
    }
});