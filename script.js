const table = document.querySelector('.game-table')
const ceils = document.querySelectorAll('.ceil')
const currentPlayer = document.querySelector('.current-player')
const resetButton = document.querySelector('#reset')
let counter = 0;
let winner = '';
const clickSound = new Audio('./assets/clickSound.mp3')
const victorySound = new Audio('./assets/victorySound.mp3')

const ceilListener = (e) => {
    addSymbol(e);
    checkWin(e);
}

table.addEventListener('click', ceilListener)

const addSymbol = (e) => {
    if(e.target.classList[0] === 'ceil' && !e.target.textContent) {
        currentPlayer.textContent = `current player is ${!(counter % 2) ? 'O' : 'X'}`
        e.target.textContent = !(counter % 2) ? 'X' : 'O'
        clickSound.play()
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
            const smb = e.target.textContent
            winner = smb;
            currentPlayer.textContent = `${smb} win in ${smb === 'O' ? counter/2 : counter/2 + .5} steps`
            ceils.forEach(item => item.classList.add('neutral'))
            combination.forEach(item => ceils[item].classList.add('win'))
            table.removeEventListener('click', ceilListener)
            victorySound.play()
        }
        else if(counter > 8 && !winner) {
            currentPlayer.textContent = `it's a draw game`
            table.removeEventListener('click', ceilListener)
        }
    })
}


resetButton.addEventListener('click', () => document.location.reload())