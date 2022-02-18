const table = document.querySelector('.game-table')
const ceils = document.querySelectorAll('.ceil')
const currentPlayer = document.querySelector('.current-player')
const resetButton = document.querySelector('#reset')
const clickSound = new Audio('./assets/sound/clickSound.mp3')
const victorySound = new Audio('./assets/sound/victorySound.mp3')
const overlay = document.querySelector('.overlay')
const menu = document.querySelector('.menu')
const settings = document.querySelector('.settings-button')
const hide = document.querySelector('.hide')
let counter = 0
let winner = ''
let isMuted = false
let isDark = false

const ceilListener = (e) => {
    addSymbol(e);
    checkWin(e);
}

table.addEventListener('click', ceilListener)

//ADD SYMBOL TI THE FIELD
const addSymbol = (e) => {
    if(e.target.classList[0] === 'ceil' && !e.target.textContent) {
        currentPlayer.textContent = `Current player is ${!(counter % 2) ? 'O' : 'X'}`
        e.target.textContent = !(counter % 2) ? 'X' : 'O'
        clickSound.play()
        counter++
    }
}

//CHECK IF SOMEBODY WON THE GAME
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
            currentPlayer.textContent = `${smb} won in ${smb === 'O' ? counter/2 : counter/2 + .5} steps`
            ceils.forEach(item => item.classList.add('neutral'))
            combination.forEach(item => ceils[item].classList.add('win'))
            table.removeEventListener('click', ceilListener)
            victorySound.play()
            addToLocalStorage(winner, smb === 'O' ? counter/2 : counter/2 + .5)
        }
        else if(counter > 8 && !winner) {
            currentPlayer.textContent = `It's a draw game`
            table.removeEventListener('click', ceilListener)
        }
    })
}

//RELOAD PAGE ON RESET
resetButton.addEventListener('click', () => document.location.reload())


const mute = () => {
    isMuted = !isMuted;
    localStorage.isMuted = isMuted
    clickSound.volume ? [clickSound, victorySound].forEach(item => item.volume = 0) : [clickSound, victorySound].forEach(item => item.volume = 1)
}

const showMenu = () => {
    overlay.classList.toggle('active-overlay')
    menu.classList.toggle('active-menu')
}

settings.addEventListener('click', showMenu)
hide.addEventListener('click', showMenu)

document.querySelectorAll('.switch').forEach(switchItem => {
    switchItem.addEventListener('click', (e) => {
        switchItem.classList.toggle('active-switch');
        if(switchItem.classList.contains('volume-switch')) mute();
    })
})

const addToLocalStorage = (winner, steps) => {
    if(localStorage.lastTen === undefined) {
        localStorage.lastTen = JSON.stringify([])
        localStorage.bestTen = JSON.stringify([])
    }

    // ADD TO LAST TEN LOCAL STORAGE
    let lastBufer = JSON.parse(localStorage.lastTen);

    if (lastBufer.length > 9) {
        lastBufer.shift()
        lastBufer.push({winner, steps})
    }
    else lastBufer.push({winner, steps})

    localStorage.lastTen = JSON.stringify(lastBufer)

    // ADD TO BEST TEN LOCAL STORAGE
    let bestBufer = JSON.parse(localStorage.bestTen);

    if (bestBufer.length > 9) {
        bestBufer.push({winner, steps})
        bestBufer.sort((a, b) => b.steps - a.steps)
        bestBufer.pop()
    }
    else bestBufer.push({winner, steps})

    localStorage.bestTen = JSON.stringify(bestBufer.sort((a, b) => a.steps - b.steps))
}