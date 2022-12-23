const ship = require("./ships");

const GameBoard = ()=>{
    return {
        shipCoordinates:[
            {name: 'carrier', coords: [33,43,53,63,73]},
            {name: 'battleship', coords: [34,35,36,37,38]},
            {name: 'cruiser', coords: [76,86,96]},
            {name: 'submarine', coords: [80,90,100]},
            {name: 'destroyer', coords: [29,39]}
        ],
        missedShots:[],
        placeShip (ship,newCoords){
            const index = this.shipCoordinates.findIndex(object => {
                return object.name === ship
            })
            if(index !== -1){this.shipCoordinates[index].coords = newCoords}
        },
        receiveAttack (coordToCheck,currPlayer){
            let shotMissed = false
            for (let i = 0; i < this.shipCoordinates.length; i++) {
                const currEl = this.shipCoordinates[i].coords
                if(currEl.includes(coordToCheck)){
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
                    const chunkOne = this.shipCoordinates[i].coords.slice()
                    break
                } else {shotMissed = true}
            }
            if (shotMissed === true){this.missedShots.push(coordToCheck)}
        }
    }
}

module.exports = {GameBoard}