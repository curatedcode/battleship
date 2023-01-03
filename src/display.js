const { check } = require("prettier")
const { Player } = require("./player")

const player = Player()
const computer = Player()
let lastMovedShip

function showGameBoard(){
    document.querySelector('.play-container').style.visibility = 'hidden'
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
    document.querySelector('.carrier').style.height = `${boardBoxSize*5}px`
    document.querySelector('.battleship').style.height = `${boardBoxSize*4}px`
    document.querySelector('.cruiser').style.height = `${boardBoxSize*3}px`
    document.querySelector('.submarine').style.height = `${boardBoxSize*3}px`
    document.getElementsByClassName('destroyer')[0].style.height = `${boardBoxSize*2}px`
    makeShipsDraggable()
}

function makeShipsDraggable(){
    const draggables = document.querySelectorAll('.ships-container > div')
    const containers = document.querySelectorAll('.player-board > .board-box')

    draggables.forEach(el =>{
        el.addEventListener('dragstart',()=>{
            el.style.opacity = '.5'
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
        })
        el.addEventListener('dragenter',()=>{
            const index = [...el.parentElement.children].indexOf(el)
            const parent = el.parentElement
            const shipName = document.querySelector('.dragging').classList[0]
            let shipLength
            let positions = [index-10,index]

            if(shipName === 'carrier'){ shipLength = 5 }
            else if(shipName === 'battleship'){ shipLength = 4 }
            else if(shipName === 'cruiser'){ shipLength = 3 }
            else if(shipName === 'submarine'){ shipLength = 3 } 

            for(let i=2;i<shipLength;i++){
                positions.push(positions[positions.length-1]+10)
            }
            if(parent.children[positions[0]].classList.length <=1 && parent.children[positions[positions.length-1]].classList.length <=1 ){
                positions.forEach(element=>{
                    parent.children[element].style.backgroundColor = 'rgb(176,0,0)'
                    parent.children[element].classList.add(shipName)
                })
            }
        })
        el.addEventListener('dragleave',()=>{
            const index = [...el.parentElement.children].indexOf(el)
            const parent = el.parentElement
            const shipName = document.querySelector('.dragging').classList[0]
            let shipLength
            let positions = [index-10,index]

            if(shipName === 'carrier'){ shipLength = 5 }
            else if(shipName === 'battleship'){ shipLength = 4 }
            else if(shipName === 'cruiser'){ shipLength = 3 }
            else if(shipName === 'submarine'){ shipLength = 3 } 

            for(let i=2;i<shipLength;i++){
                positions.push(positions[positions.length-1]+10)
            }
            if(parent.children[positions[0]].classList[1] === shipName && parent.children[positions[positions.length-1]].classList[1] === shipName ){
                positions.forEach(element=>{
                    parent.children[element].removeAttribute('style')
                    parent.children[element].classList.remove(shipName)
                })
            }
        })
        el.addEventListener('drop',e=>{
            e.preventDefault()
            const draggedEl = document.querySelector('.dragging')
            draggedEl.style.visibility = 'hidden'
            lastMovedShip = draggedEl.classList[0]
        })
    })
}

function rotateShip(){
    const shipLocations = document.querySelectorAll(`.board-box.${lastMovedShip}`)
    const shipName = lastMovedShip
    const firstShipIndex = [...shipLocations[0].parentElement.children].indexOf(shipLocations[0])
    const lastShipIndex = [...shipLocations[shipLocations.length-1].parentElement.children].indexOf(shipLocations[shipLocations.length-1])
    const parent = shipLocations[0].parentElement
    const color = 'rgb(176,0,0)'

    function hasBoxBeenShifted(operation){
        for(let i=0;i<shipLocations.length;i++){
            if(shipLocations[i].classList.contains(operation)){
                console.log(shipLocations[i])
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
        console.log({clearLocations,rotation})
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
            let ship = document.querySelectorAll(currShip)
            if(i === 0){currShip = 'board-box.carrier'}
            else if(i === 1) {currShip = 'board-box.battleship'}
            else if(i === 2) {currShip = 'board-box.cruiser'}
            else if(i === 3) {currShip = 'board-box.submarine'}
            else if(i === 4) {currShip = 'board-box.destroyer'}
            ship.forEach(el=>{
                shipIndexes.push([...el.parentElement.children].indexOf(el))
            })
            player.gameBoard.shipCoordinates[i].coords = shipIndexes
        }
        console.log(currShip,player.gameBoard.shipCoordinates)
        addPlayerShipsToBoard()
    }
}

function addPlayerShipsToBoard(){
    for(let i=0;i<player.gameBoard.shipCoordinates.length;i++){
        const currShip = player.gameBoard.shipCoordinates[i]
        const colors = ['black','white','blue','red','purple']
        const currColor = colors[i]
        for(let g=0;g<currShip.coords.length;g++){
            document.querySelector('.player-board').children[currShip.coords[g]].style.backgroundColor = `${currColor}`
        }
    }
    document.querySelector('.enemy-board').classList.toggle('hidden')
    addAttackEventListeners()
}

function addAttackEventListeners(){
    const attackBoard = document.querySelector('.attack-board')
    for(let i=0;i<attackBoard.childElementCount;i++){
        const box = attackBoard.children[i]
        box.addEventListener('click',()=>{
            const attackBoard = document.querySelector('.attack-container')
            player.sendAttack([...box.parentElement.children].indexOf(box),computer.gameBoard,computer.ships)
            attackBoard.style.visibility = 'hidden'
            showPlacedShots(document.querySelector('.attack-board'),computer)
            showPlacedShots(document.querySelector('.enemy-board'),computer)
            setTimeout(()=>{
                computer.sendAttack(computer.computer.randomCoord(),player.gameBoard,player.ships)
                showPlacedShots(document.querySelector('.player-board'),player)
                checkForWinner(player,computer)
            },500)
            setTimeout(()=>{attackBoard.style.visibility = 'visible'},1500)
        })
    }
}

function showPlacedShots(gameBoard,player){
    for(let i=0;i<gameBoard.childElementCount;i++){
        const currChildIndex = [...gameBoard.children].indexOf(gameBoard.children[i])
        if(player.gameBoard.allShotsTaken.includes(currChildIndex) && !player.gameBoard.missedShots.includes(currChildIndex)){
            gameBoard.children[currChildIndex].style.backgroundColor = 'rgb(176,0,0)'
        } else if (player.gameBoard.missedShots.includes(currChildIndex)){
            gameBoard.children[currChildIndex].style.backgroundColor = 'rgb(30,41,59)'
        }
    }
}

function checkForWinner(player,computer){
    if(player.gameBoard.isGameOver(player.ships)){
        alert('You Have Won')
    } else if (computer.gameBoard.isGameOver(computer.ships)){
        alert('You Have Lost')
    }
}

// addEventListener()
window.onresize = updateShipSizes

module.exports = {
    showGameBoard
}