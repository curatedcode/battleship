const shipModule = require('./ships')
const gameBoardModule = require('./gameboard')


const Player = ()=>{
    return{
        gameBoard: gameBoardModule.GameBoard(),
        ships: shipModule.Ship(),
        computer: {
            usedMoves: [],
            randomCoord (coord = Math.floor(Math.random()*100)){
                if(coord > -1 && coord < 100 && !this.usedMoves.includes(coord)){
                    this.usedMoves.push(coord)
                    return coord
                } else {
                    return this.randomCoord(Math.floor(Math.random()*100))
                }
            },
            fillShipCoords (playerGameBoard){
                let allCoords = []
                function randomShipCoords(shipLength){
                    const axis = Math.floor(Math.random()*2)
                    const firstCoord = Math.floor(Math.random()*100)
                    let generatedCoords = []
                    if(allCoords.includes(firstCoord)){
                        return randomShipCoords(shipLength)
                    } else (generatedCoords.push(firstCoord))
                    if(axis === 0){
                        generateSameAxisCoords(shipLength,1)
                    } else {
                        generateSameAxisCoords(shipLength,10)
                    }
                    function generateSameAxisCoords(shipLength,baseValue){
                        let lowerCoordNum = firstCoord-baseValue
                        let higherCoordNum = firstCoord+baseValue
                        for(let i=0;i<shipLength;i++){
                            if(lowerCoordNum > 0 && higherCoordNum < 100){
                                if(String(lowerCoordNum)[0] === String(firstCoord)[0]){
                                    generatedCoords.unshift(lowerCoordNum)
                                    lowerCoordNum = generatedCoords[0]-baseValue
                                } else {
                                    generatedCoords.push(higherCoordNum)
                                    higherCoordNum = generatedCoords[generatedCoords.length-1]+baseValue
                                }
                            }
                        }
                    }
                    if(generatedCoords.length === shipLength && !generatedCoords.some(el=>allCoords.includes(el))){
                        generatedCoords.forEach(num => allCoords.push(num))
                        return generatedCoords
                    } else {
                        return randomShipCoords(shipLength)
                    }
                }
                playerGameBoard.shipCoordinates.forEach(arr => {
                    arr.coords = randomShipCoords(arr.coords.length)
                })
            },
        },
        sendAttack (coord,opponentBoard,opponentShips){
            opponentBoard.receiveAttack(coord,opponentShips)
        }
    }
}

module.exports = {Player}