const table = document.querySelector('.game-table')
const ceils = document.querySelectorAll('.ceil')
const currentPlayer = document.querySelector('.current-player')
const resetButton = document.querySelector('#reset')
let counter = 0;
let winner = '';

const ceilListener = (e) => {
    addSymbol(e);
    checkWin(e);
}

table.addEventListener('click', ceilListener)

const addSymbol = (e) => {
    if(e.target.classList[0] === 'ceil' && !e.target.textContent) {
        currentPlayer.textContent = `current player is ${!(counter % 2) ? 'O' : 'X'}`
        e.target.textContent = !(counter % 2) ? 'X' : 'O'
        counter++
    }
}

const checkWin = (e) => {
    const combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    combinations.forEach(combination => {
        if (combination.every(item => ceils[item].textContent === e.target.textContent)) {
            currentPlayer.textContent = `${e.target.textContent} win`
            combination.forEach(item => ceils[item].classList.add('win'))
            winner = e.target.textContent;
            table.removeEventListener('click', ceilListener)
        }
        else if(counter > 8 && !winner) {
            currentPlayer.textContent = `it's a draw game`
            table.removeEventListener('click', ceilListener)
        }
    })
}

resetButton.addEventListener('click', () => document.location.reload())