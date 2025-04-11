const reserveButton = document.getElementById('reserve');

reserveButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const machineId = reserveButton.getAttribute('machineId');
    window.location.href = `/machine/${machineId}/reserve`;
});