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
            }
        },
        sendAttack (coord,opponentBoard,opponentShips){
            opponentBoard.receiveAttack(coord,opponentShips)
        }
    }
}

module.exports = {Player}