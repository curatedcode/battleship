
const Ship = ()=>{
    return {
        allShips: [
            {name: 'carrier', info: {
                length: 5,
                hitCount: 0,
                sunk: false
            }},
            {name: 'battleship', info: {
                length: 4,
                hitCount: 0,
                sunk: false
            }},
            {name: 'cruiser', info: {
                length: 3,
                hitCount: 0,
                sunk: false
            }},
            {name: 'submarine', info: {
                length: 3,
                hitCount: 0,
                sunk: false
            }},
            {name: 'destroyer', info: {
                length: 2,
                hitCount: 0,
                sunk: false
            }}
        ],
        hit (ship){
            for (let i=0;i<this.allShips.length;i++){
                if(this.allShips[i].name === ship){
                    this.allShips[i].info.hitCount++
                    if(this.allShips[i].info.hitCount === this.allShips[i].info.length) {
                        return this.isSunk(this.allShips[i].info)
                    }
                }
            }
            
        },
        isSunk (ship){
            return ship.sunk = true
        }
    }
}

module.exports = {Ship}