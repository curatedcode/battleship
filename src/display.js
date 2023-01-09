const { Player } = require("./player")

window.onresize = updateShipSizes

const player = Player()
const computer = Player()
let lastMovedShip

function showGameBoard(){
    document.querySelector('.play-container').style.display = 'none'
    document.querySelector('.action-buttons').classList.toggle('hidden')
    document.querySelector('.player-board').classList.remove('hidden')
    document.querySelector('.ships-container').classList.toggle('hidden')
    document.querySelector('.fa-rotate').addEventListener('click',rotateShip)
    document.querySelector('.fa-circle-play').addEventListener('click',startGame)
    updateShipSizes()
}

function updateShipSizes(){
    const shipContainer = document.querySelector('.ships-container')
    const boardBoxSize = document.querySelector('.board-box').offsetWidth
    const children = [...shipContainer.children]
    children.forEach(element => {
        element.style.width = `${boardBoxSize}px`
    });
    document.querySelector('.ships-container > .carrier').style.height = `${boardBoxSize*5}px`
    document.querySelector('.ships-container > .battleship').style.height = `${boardBoxSize*4}px`
    document.querySelector('.ships-container > .cruiser').style.height = `${boardBoxSize*3}px`
    document.querySelector('.ships-container > .submarine').style.height = `${boardBoxSize*3}px`
    document.querySelector('.ships-container > .destroyer').style.height = `${boardBoxSize*2}px`
    makeShipsDraggable()
}

function makeShipsDraggable(){
    const draggables = document.querySelectorAll('.ships-container > div')
    const containers = document.querySelectorAll('.player-board > .board-box')

    draggables.forEach(el =>{
        el.addEventListener('dragstart',e=>{
            el.style.opacity = '.5'
            const heightThreeQuarter = Math.round((el.getBoundingClientRect().height)/3.5)
            const middleWidth = Math.round((el.getBoundingClientRect().width)/2)
            e.dataTransfer.setDragImage(e.path[0],middleWidth,heightThreeQuarter)
            el.classList.add('dragging')
        })
        el.addEventListener('dragend',()=>{
            el.style.opacity = '1'
            el.classList.remove('dragging')
        })
    })

    containers.forEach(el =>{
        el.addEventListener('dragover',e=>{
            e.preventDefault()
            highlightBoxes(e)
        })
        el.addEventListener('dragleave',removeBoxHighlights)
        el.addEventListener('drop',e=>{
            e.preventDefault()
            const draggedEl = document.querySelector('.dragging')
            const boxShipClass = `.board-box.${draggedEl.classList[0]}`
            if(document.querySelector(boxShipClass)){
                draggedEl.style.visibility = 'hidden'
                lastMovedShip = draggedEl.classList[0]
            }

        })
    })
}

function highlightBoxes(e){
    const draggedEl = document.querySelector('.dragging')
    const shipName = draggedEl.classList[0]
    const parent = document.querySelector('.player-board')
    const index = [...parent.children].indexOf(e.target)
    const ships = player.ships.allShips
    let shipLength
    ships.forEach(obj =>{
        if(obj.name === shipName) return shipLength = obj.info.length
    })
    let positions = [index]
    for(let i=1; i<shipLength; i++){
        const higherPosition = positions[positions.length-1]+10
        const lowerPosition = positions[0]-10
        if(higherPosition < 100){
            positions.push(higherPosition)
        } else if (lowerPosition > 0){
            positions.unshift(lowerPosition)
        }
    }
    if(positions.every(index => parent.children[index].classList.length < 2)){
        positions.forEach(element=>{
            parent.children[element].style.backgroundColor = 'rgb(30 41 59)'
            parent.children[element].classList.add(shipName)
        })
    }
}

function removeBoxHighlights(e){
    const draggedEl = document.querySelector('.dragging')
    const shipName = draggedEl.classList[0]
    document.querySelectorAll('.board-box').forEach(box =>{
        if(box.classList.contains(shipName)){
            box.removeAttribute('style')
            box.classList.remove(shipName)
        }
    })
}

function rotateShip(){
    const shipLocations = document.querySelectorAll(`.board-box.${lastMovedShip}`)
    const shipName = lastMovedShip
    const firstShipIndex = [...shipLocations[0].parentElement.children].indexOf(shipLocations[0])
    const lastShipIndex = [...shipLocations[shipLocations.length-1].parentElement.children].indexOf(shipLocations[shipLocations.length-1])
    const parent = shipLocations[0].parentElement
    const color = 'rgb(30 41 59)'

    function hasBoxBeenShifted(operation){
        for(let i=0;i<shipLocations.length;i++){
            if(shipLocations[i].classList.contains(operation)){
                return true
            }
        }
    }

    function areBoxesAlreadyUsed(operation){
        for(let i=1;i<shipLocations.length;++i){
            if(operation === 'ml'){
                if(parent.children[firstShipIndex-i].hasAttribute('style')){
                    return true
                }
            } else if(operation === 'mt'){
                if(parent.children[lastShipIndex-(i*10)].hasAttribute('style')){
                    return true
                }
            } else if(operation === 'mr'){
                if(parent.children[lastShipIndex+i].hasAttribute('style')){
                    return true
                }
            } else if(operation === 'md'){
                if(parent.children[firstShipIndex+(i*10)].hasAttribute('style')){
                    return true
                }
            }
        }
    }

    function applyRotation(operation,locations){
        if(locations.length !== shipLocations.length-1) return
        if(operation === 'ml'){
            for(let i=1;i<shipLocations.length;i++){
                const currLocation = locations[i-1]
                shipLocations[i].classList.remove(shipName)
                shipLocations[i].removeAttribute('style')
                parent.children[currLocation].classList.add(shipName)
                parent.children[currLocation].style.backgroundColor = color
            }
            shipLocations[0].classList.add(operation)
        } else {
            for(let i=1;i<shipLocations.length;i++){
                const currLocation = locations[i-1]
                shipLocations[i].classList.remove(shipName)
                shipLocations[i].removeAttribute('style')
                shipLocations[0].removeAttribute('style')
                shipLocations[shipLocations.length-1].classList.add(shipName)
                shipLocations[shipLocations.length-1].style.backgroundColor = color
                parent.children[currLocation].classList.add(shipName)
                parent.children[currLocation].style.backgroundColor = color
            }
            if(operation === 'mt' || operation === 'mr'){
                shipLocations[shipLocations.length-1].classList.add(operation)
                shipLocations[0].classList.remove(shipName)
            }
        }
    }
    function checkForClearLocations(rotation){
        let clearLocations = []
        if(rotation === 'left'){
            for(let i=1;i<shipLocations.length;i++){
                const operationIndex = firstShipIndex - i
                if(parent.children[operationIndex]){
                    if(parent.children[operationIndex].classList.length < 2){
                        clearLocations.push(operationIndex)
                    }
                }
            }
        } else if(rotation === 'top'){
            for(let i=0;i<shipLocations.length;i++){
                const operationIndex = lastShipIndex-(i*10)
                if(parent.children[operationIndex]){
                    if(parent.children[operationIndex].classList.length <= 2){
                        clearLocations.push(operationIndex)
                    }
                }
            }
        } else if(rotation === 'right'){
            for(let i=1;i<shipLocations.length;i++){
                const operationIndex = lastShipIndex+i
                if(parent.children[operationIndex]){
                    if(parent.children[operationIndex].classList.length <= 1){
                        clearLocations.push(operationIndex)
                    }
                }
            }
        } else if(rotation === 'down'){
            for(let i=1;i<shipLocations.length;i++){
                const operationIndex = firstShipIndex+(i*10)
                if(parent.children[operationIndex]){
                    if(parent.children[operationIndex].classList.length <= 1){
                        clearLocations.push(operationIndex)
                    }
                }
            }
        }
        return clearLocations
    }
    if(String(firstShipIndex)[0] === String(firstShipIndex-shipLocations.length+1)[0] && !hasBoxBeenShifted('ml') && !areBoxesAlreadyUsed('ml')){
        applyRotation('ml',checkForClearLocations('left'))
    } else if(lastShipIndex-(10*(shipLocations.length-1)) >= 0 && !hasBoxBeenShifted('mt') && !areBoxesAlreadyUsed('mt')){
        applyRotation('mt',checkForClearLocations('top'))
    } else if(String(lastShipIndex)[0] === String(lastShipIndex+shipLocations.length-1)[0] && !hasBoxBeenShifted('mr') && !areBoxesAlreadyUsed('mr')){
        applyRotation('mr',checkForClearLocations('right'))
    } else if (firstShipIndex+(10*(shipLocations.length-1)) >= 0){
        applyRotation('md',checkForClearLocations('down'))
    }
}

function startGame(){
    if(document.querySelector('.board-box.carrier') && document.querySelector('.board-box.battleship') && document.querySelector('.board-box.submarine') && document.querySelector('.board-box.cruiser') && document.querySelector('.board-box.destroyer')) {
        document.querySelector('.action-buttons').classList.toggle('hidden')
        document.querySelector('.ships-container').classList.toggle('hidden')
        storeShipLocations()
    } else {
        alert('Please Place All Ships!')
    }
    function storeShipLocations(){
        for(let i=0;i<=player.gameBoard.shipCoordinates.length-1;i++){
            let currShip
            let shipIndexes = []
            if(i === 0){currShip = '.board-box.carrier'}
            else if(i === 1) {currShip = '.board-box.battleship'}
            else if(i === 2) {currShip = '.board-box.cruiser'}
            else if(i === 3) {currShip = '.board-box.submarine'}
            else if(i === 4) {currShip = '.board-box.destroyer'}
            document.querySelectorAll(currShip).forEach(el=>{
                shipIndexes.push([...el.parentElement.children].indexOf(el))
            })
            player.gameBoard.shipCoordinates[i].coords = shipIndexes
        }
        addPlayerShipsToBoard()
    }
}

function addPlayerShipsToBoard(){
    computer.computer.fillShipCoords(computer.gameBoard)
    player.gameBoard.shipCoordinates.forEach(ship =>{
        ship.coords.forEach(coord =>{
            document.querySelector('.player-board').children[coord].style.backgroundColor = 'rgb(50,32,60)'
        })
    })
    computer.gameBoard.shipCoordinates.forEach(ship =>{
        ship.coords.forEach(coord =>{
            document.querySelector('.enemy-board').children[coord].classList.add(ship.name)
        })
    })
    document.querySelector('.enemy-board').classList.toggle('hidden')
    addAttackEventListeners()
}

function addAttackEventListeners(){
    document.querySelector('.attack-container').classList.toggle('hidden')
    const attackBoardBoxes = document.querySelectorAll('.attack-board > .board-box')

    function putIconOnBoard(index,attacker){
        const targetIcon = document.querySelector('.target-icon')
        const playerBoard = document.querySelector('.player-board')
        const enemyBoard = document.querySelector('.enemy-board')
        let boundingLeft
        let boundingTop
        if(attacker === 'player'){
            boundingLeft = Math.floor(enemyBoard.children[index].getBoundingClientRect().left+window.scrollX)
            boundingTop = Math.floor(enemyBoard.children[index].getBoundingClientRect().top+window.scrollY)
        } else if (attacker === 'computer'){
            boundingLeft = Math.floor(playerBoard.children[index].getBoundingClientRect().left+window.scrollX)
            boundingTop = Math.floor(playerBoard.children[index].getBoundingClientRect().top+window.scrollY)
        }
        targetIcon.src = require('./images/crosshair.svg')
        targetIcon.setAttribute('style',`width:${playerBoard.children[0].offsetWidth}px; color: rgb(255,0,0); position: fixed; left:${boundingLeft}px; top:${boundingTop}px; scale: 1.5;`)
    }
    attackBoardBoxes.forEach(el =>{
        el.addEventListener('click',()=>{
            const attackBoard = document.querySelector('.attack-container')
            const targetIcon = document.querySelector('.target-icon')
            const index = [...el.parentElement.children].indexOf(el)
            putIconOnBoard(index,'player')
            targetIcon.classList.toggle('hidden')
            attackBoard.classList.toggle('hidden')
            player.sendAttack(index,computer.gameBoard,computer.ships)
            setTimeout(()=>{
                if(lastShotHit() && player.gameBoard.allShotsTaken.length > 0){
                    const lastShot = player.gameBoard.allShotsTaken[player.gameBoard.allShotsTaken.length-1]
                    let nextShot = lastShot+10
                    if(nextShot > 99){
                        nextShot = lastShot-10
                    } else if (nextShot < 100 && Math.random() > .5){
                        if(String(lastShot)[0] === String(lastShot+1)[0]){
                            nextShot = lastShot+1
                        } else if (String(lastShot)[0] === String(lastShot-1)[0]){
                            nextShot = lastShot-1
                        }
                    }
                    if(!computer.computer.usedMoves.includes(nextShot)){
                        computer.sendAttack(nextShot,player.gameBoard,player.ships)
                    } else {
                        computer.sendAttack(computer.computer.randomCoord(),player.gameBoard,player.ships)
                    }
                } else {
                    computer.sendAttack(computer.computer.randomCoord(),player.gameBoard,player.ships)
                }
                showPlacedShots(document.querySelector('.attack-board'),computer)
                showPlacedShots(document.querySelector('.enemy-board'),computer)
                putIconOnBoard(player.gameBoard.allShotsTaken[player.gameBoard.allShotsTaken.length-1], 'computer')
            },2000)
            setTimeout(()=>{
                showPlacedShots(document.querySelector('.player-board'),player)
            },3000)
            checkForWinner()
            setTimeout(()=>{
                targetIcon.classList.toggle('hidden')
                attackBoard.classList.toggle('hidden')
            },4000)
            el.classList.remove('hover:bg-slate-700','hover:cursor-pointer')
            el.replaceWith(el.cloneNode(true))
        })
    })
    function lastShotHit(){
        const allShotsTaken = player.gameBoard.allShotsTaken
        const missedShots = player.gameBoard.missedShots
        if(missedShots.includes(allShotsTaken[allShotsTaken.length-1])){ return false }
        else { return true }
    }
}

function showPlacedShots(gameBoard,player){
    player.gameBoard.allShotsTaken.forEach(coord =>{
        const gameBoardChild = gameBoard.children[coord]
        if(player.gameBoard.missedShots.includes(coord)){
           gameBoardChild.style.backgroundColor = 'rgb(30,41,59)'
        } else {
            gameBoardChild.style.backgroundColor = 'rgb(176,0,0'
        }
    })

    if(player === computer){
        computer.ships.allShips.forEach(ship=>{
            if(ship.info.sunk){
                updateColor(ship,'enemy')
            }
        })
    } else if(player !== computer){
        player.ships.allShips.forEach(ship=>{
            if(ship.info.sunk){
                updateColor(ship,'player')
            }
        })
    }

    function updateColor(ship,player){
        if(ship.info.sunk){
            document.querySelectorAll(`.${player}-board > .board-box.${ship.name}`).forEach(el =>{
                el.classList.add('transition-all')
                el.style.backgroundColor = 'rgba(128,5,0,0.5)'
            })
        }
    }
}

function checkForWinner(){
    if(player.gameBoard.isGameOver(player.ships)){
        alert('You Have Lost')
    } else if (computer.gameBoard.isGameOver(computer.ships)){
        alert('You Have Won')
    }
}

module.exports = {
    showGameBoard
}