
const Ship = ()=>{

    let carrier = {
        length: 5,
        hitCount: 0,
        sunk: false
    }
    let battleship = {
        length: 5,
        hitCount: 0,
        sunk: false
    }
    let cruiser = {
        length: 3,
        hitCount: 0,
        sunk: false
    }
    let submarine = {
        length: 3,
        hitCount: 0,
        sunk: false
    }
    let destroyer = {
        length: 2,
        hitCount: 0,
        sunk: false
    }

    function hit(ship){
        return ship.hitCount = hitCount + 1
    }

    function isSunk(ship){
        ship.sunk = true
    }
    return {
        carrier: carrier,
        battleship: battleship,
        cruiser: cruiser,
        submarine: submarine,
        destroyer: destroyer,
        hit: hit,
        isSunk: isSunk
    }
}

module.exports = {
    Ship
}