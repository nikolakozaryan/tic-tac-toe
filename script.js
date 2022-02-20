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
const options = document.querySelectorAll('.settings-header, .leaderbord-header')
let counter = 0
let winner = ''
let isMuted = localStorage.isMuted ? JSON.parse(localStorage.isMuted) : false
let isDark = localStorage.isDark ? JSON.parse(localStorage.isDark) : false

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
            currentPlayer.textContent = `${smb} won in ${counter} steps`
            ceils.forEach(item => item.classList.add('neutral'))
            combination.forEach(item => ceils[item].classList.add('win'))
            table.removeEventListener('click', ceilListener)
            victorySound.play()
            addToLocalStorage(winner, counter)
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

const activateDark  = () => {
    isDark = !isDark
    localStorage.isDark = isDark
    const head = document.querySelector('head');
    const dark = document.createElement('link');
    dark.href = './assets/styles/dark.css'
    dark.rel = 'stylesheet'
    isDark ? head.appendChild(dark) : head.removeChild(head.lastChild)
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
        if(switchItem.classList.contains('theme-switch')) activateDark();
    })
})

const getStringDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let now = new Date()
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

const addToLocalStorage = (winner, steps) => {

    // ADD TO LAST TEN LOCAL STORAGE
    let lastBufer = JSON.parse(localStorage.lastTen);

    if (lastBufer.length > 9) {
        lastBufer.shift()
        lastBufer.push({winner, steps, date: getStringDate()})
    }
    else lastBufer.push({winner, steps, date: getStringDate()})

    localStorage.lastTen = JSON.stringify(lastBufer)

    // ADD TO BEST TEN LOCAL STORAGE
    let bestBufer = JSON.parse(localStorage.bestTen);

    if (bestBufer.length > 9) {
        bestBufer.push({winner, steps, date: getStringDate()})
        bestBufer.sort((a, b) => a.steps - b.steps)
        bestBufer.pop()
    }
    else bestBufer.push({winner, steps, date: getStringDate()})

    localStorage.bestTen = JSON.stringify(bestBufer.sort((a, b) => a.steps - b.steps))
}

const fillTables = () => {
    const bestTable = menu.querySelector('#best')
    const bestData = JSON.parse(localStorage.getItem('bestTen'))
    createTableCeils(bestTable)

    const bestTableRows = document.querySelectorAll('#best>tr')
    bestTableRows.forEach((row, index) => fillTableRow(row, bestData[index]))

    // const lastTable = menu.querySelector('#last')
    // const lastData = JSON.parse(localStorage.getItem('lastTen'))
    // createTableCeils(lastTable)
    // const lastTableRows = document.querySelectorAll('#last>tr')
    // lastTableRows.forEach((row, index) => fillTableRow(row, lastData[index]))
}

const createTableCeils = (table) => {
    for(let i = 1; i <= 10; i++) {
        const tableRow = document.createElement('tr')
        const positionCeil = document.createElement('td')
        positionCeil.textContent = i;
        tableRow.appendChild(positionCeil)
        for (let j = 0; j < 3; j++) tableRow.appendChild(document.createElement('td'))
        table.appendChild(tableRow)
    }
}

const fillTableRow = (row, data) => {
    let ceils = row.childNodes;
    for (let i = 1; i < 4; i++) {
        ceils[i].textContent = data ? Object.values(data)[i - 1] : '' 
    }
}

const preload = () => {
    if(isMuted) {
        document.querySelector('.volume-switch').classList.add('active-switch');
        [clickSound, victorySound].forEach(item => item.volume = 0)
    }
    if(isDark) {
        document.querySelector('.theme-switch').classList.add('active-switch')
        const head = document.querySelector('head');
        const dark = document.createElement('link');
        dark.href = './assets/styles/dark.css'
        dark.rel = 'stylesheet'
        head.appendChild(dark)
    };

    if(localStorage.lastTen === undefined) {
        localStorage.lastTen = JSON.stringify([])
        localStorage.bestTen = JSON.stringify([])
    }

    fillTables()
}

preload()

options.forEach(option => {
    option.addEventListener('click', (e) => {
        options.forEach(item => item.classList.toggle('active-option'))
        if (e.target.classList.contains('settings-header')) {
            document.querySelector('.settings').style.display = 'flex'
            document.querySelector('.tables').style.display = 'none'
        } else {
            document.querySelector('.settings').style.display = 'none'
            document.querySelector('.tables').style.display = 'block'
        }
    })
})