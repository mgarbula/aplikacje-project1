const myMachinesButton = document.getElementById('myMachines');
const allMachinesButton = document.getElementById('allMachines');
const myAccountButton = document.getElementById('myAccount');

myMachinesButton.addEventListener('click', () => {
    window.location.href = '/my-machines';
});

allMachinesButton.addEventListener('click', () => {
    window.location.href = '/';
});

myAccountButton.addEventListener('click', () => {
    window.location.href = '/account'
});