
const Ship = ()=>{
    return {
        carrier: {
            length: 5,
            hitCount: 0,
            sunk: false
        },
        battleship: {
            length: 5,
            hitCount: 0,
            sunk: false
        },
        cruiser: {
            length: 3,
            hitCount: 0,
            sunk: false
        },
        submarine: {
            length: 3,
            hitCount: 0,
            sunk: false
        },
        destroyer: {
            length: 2,
            hitCount: 0,
            sunk: false
        },
        hit (ship){
            if(ship === 'carrier') {ship = this.carrier; console.log(ship)}
            else if (ship === 'battleship') {ship = this.battleship}
            else if (ship === 'cruiser') {ship = this.cruiser}
            else if (ship === 'submarine') {ship = this.submarine}
            else if (ship === 'destroyer') {ship = this.destroyer}
            ship.hitCount++
            if(ship.hitCount === ship.length) console.log(ship); return this.isSunk(ship)
        },
        isSunk (ship){
            return ship.sunk = true
        }
    }
}

module.exports = {
    Ship
}