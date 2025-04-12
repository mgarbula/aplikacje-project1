const machineMgmtButton = document.getElementById('machineMgmt');
const userMgmtButton = document.getElementById('userMgmt');

machineMgmtButton.addEventListener('click', () => {
    window.location.href = '/machines-management';
});
userMgmtButton.addEventListener('click', () => {
    window.location.href = '/users-management';
});
