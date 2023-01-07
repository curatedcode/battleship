const shipModule = require('./ships')
const gameBoardModule = require('./gameboard')


const Player = ()=>{
    return{
        gameBoard: gameBoardModule.GameBoard(),
        ships: shipModule.Ship(),
        computer: {
            usedMoves: [],
            randomCoord (coord = 0){
                if(coord !== 0 && coord !== this.usedMoves.includes(coord)){
                    this.usedMoves.push(coord)
                    return coord
                }
                return this.randomCoord(Math.floor(Math.random()*100)+1)
            },
            fillShipCoords (playerGameBoard){
                let allCoords = [[],[],[],[],[],[]]
                function coordNotUsed(value){
                    for(let i=0;i<allCoords.length;i++){
                        if(allCoords[i].includes(value)) return false
                    }
                    return true
                }
                function randomCoord(coord = 0){
                    if(coord !== 0 && coordNotUsed(coord)){
                        allCoords[5].push(coord)
                        return coord
                    }
                    return randomCoord(Math.floor(Math.random()*100)+1)
                }
                function isCoordOnBoard(value){
                    if(value >= 0 && value < 100) return true
                    return false
                }

                for(let i=0;i<playerGameBoard.shipCoordinates.length;i++){
                    const coordArrLength = playerGameBoard.shipCoordinates[i].coords.length;
                    const currCoordArr = allCoords[i]
                    for(let g=0;g<coordArrLength;g++){
                        const currCoord = currCoordArr[currCoordArr.length-1]
                        const firstCoord = currCoordArr[0]
                        if(currCoordArr.length > 0){
                            if(firstCoord%2 === 0){
                                if(coordNotUsed(currCoord+10) && isCoordOnBoard(currCoord+10)){
                                    currCoordArr.push(currCoord+10)
                                } else if (coordNotUsed(firstCoord-10) && isCoordOnBoard(firstCoord-10)){
                                    currCoordArr.unshift(firstCoord-10)
                                }
                            } else {
                                if (coordNotUsed(currCoord+1) && isCoordOnBoard(currCoord+1)){
                                    currCoordArr.push(currCoord+1)
                                } else if (coordNotUsed(firstCoord-1) && isCoordOnBoard(firstCoord-1)){
                                    currCoordArr.unshift(firstCoord-1)
                                }
                            }
                        } else {
                            currCoordArr.push(randomCoord())
                        }
                    }
                    playerGameBoard.shipCoordinates[i].coords = allCoords[i]
                }
                console.log(allCoords)
            },
        },
        sendAttack (coord,opponentBoard,opponentShips){
            opponentBoard.receiveAttack(coord,opponentShips)
        }
    }
}

module.exports = {Player}