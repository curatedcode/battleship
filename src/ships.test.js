const ships = require('./ships')

describe('increase hit count until ship is sunk',()=>{
    const shipTest = ships.Ship()
    beforeAll(()=>{
        shipTest.hit('destroyer')
        shipTest.hit('destroyer')        
    })
    test('increase destroyer hitCount to 2',()=>{
        expect(shipTest.allShips[4].info.hitCount).toBe(2)
    })
    test('sink the destroyer ship',()=>{
        expect(shipTest.allShips[4].info.sunk).toBe(true)
    })
})

