const ship = require("./ships");

const GameBoard = ()=>{
    return {
        shipCoordinates:[
            {name: 'carrier', coords: [33,43,53,63,73]},
            {name: 'battleship', coords: [35,36,37,38]},
            {name: 'cruiser', coords: [76,86,96]},
            {name: 'submarine', coords: [80,90,100]},
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
                    const index = this.shipCoordinates[i].coords.indexOf(coordToCheck)
                    if(index === 0){
                        const newArray = this.shipCoordinates[i].coords.slice(1)
                        this.shipCoordinates[i].coords = newArray
                    } else if (index === this.shipCoordinates[i].coords.length){
                        const newArray = this.shipCoordinates[i].coords.slice(0,-1)
                        this.shipCoordinates[i].coords = newArray
                    } else {
                        const arrayOne = this.shipCoordinates[i].coords.slice(0,index)
                        const arrayTwo = this.shipCoordinates[i].coords.slice(index+1)
                        this.shipCoordinates[i].coords = arrayOne.concat(arrayTwo)
                    }
                } else {shotMissed = true}
            }
            if (shotMissed){this.missedShots.push(coordToCheck)}
        },
        isGameOver (playerShips){
            let sunkShips = []
            for(let i=0; i<playerShips.allShips.length;i++){
                if(playerShips.allShips[i].sunk){
                    sunkShips.push(playerShips.allShips[i].name)
                }
            }
            if(sunkShips.length === this.shipCoordinates.length) return true
        }
    }
}

module.exports = {GameBoard}