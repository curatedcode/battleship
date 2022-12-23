const gameBoardFile = require('./gameboard')
const ship = require('./ships')
const gameBoardOne = gameBoardFile.GameBoard()

describe('place the ship then verify no other coords were modified',()=>{
    beforeAll(()=>{
        gameBoardOne.placeShip('destroyer',[30,40])
    })
    test('place the ship at coords',()=>{
        expect(gameBoardOne.shipCoordinates[4].coords).toStrictEqual([30,40])
    })
    test('verify no other ship coords were changed',()=>{
        expect(gameBoardOne.shipCoordinates[0].coords).toStrictEqual([33,43,53,63,73])
    })
})

describe('check if receiveAttack hits ship if so, remove coord and trigger hit function on relevant ship',()=>{
    const testShip = ship.Ship()
    test('check if receiveAttack has hit a ship',()=>{
        gameBoardOne.receiveAttack(44,testShip)
        expect(gameBoardOne.missedShots).toStrictEqual([44])
    })
    test('if receiveAttack hits a ship update hitCount of relevant ship',()=>{
        gameBoardOne.receiveAttack(43,testShip)
        expect(testShip.carrier.hitCount).toBe(1)
    })
    test('verify that relevant ship coord is removed',()=>{
        expect(gameBoardOne.shipCoordinates[0].coords).toStrictEqual([33,53,63,73])
    })
})


