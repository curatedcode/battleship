const ship = require("./ships");

const GameBoard = ()=>{
    return {
        shipCoordinates:[
            {name: 'carrier', coords: [33,43,53,63,73]},
            {name: 'battleship', coords: [35,36,37,38]},
            {name: 'cruiser', coords: [76,86,96]},
            {name: 'submarine', coords: [70,80,90]},
            {name: 'destroyer', coords: [16,17]}
        ],
        missedShots: [],
        allShotsTaken: [],
        placeShip (ship,newCoords){
            const index = this.shipCoordinates.findIndex(object => {
                return object.name === ship
            })
            if(index !== -1){this.shipCoordinates[index].coords = newCoords}
        },
        receiveAttack (coordToCheck,currPlayer){
            let shotMissed = false
            this.allShotsTaken.push(coordToCheck)
            for (let i = 0; i < this.shipCoordinates.length; i++) {
                if(this.shipCoordinates[i].coords.includes(coordToCheck)){
                    currPlayer.hit(this.shipCoordinates[i].name)
                    shotMissed = false
                    break
                } else {shotMissed = true}
            }
            if (shotMissed){this.missedShots.push(coordToCheck)}
        },
        isGameOver (playerShips){
            for(let i=0; i<playerShips.allShips.length;i++){
                if(!playerShips.allShips[i].info.sunk){
                    return false
                }
            }
            return true
        }
    }
}

module.exports = {GameBoard}