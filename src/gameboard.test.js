const gameBoard = require('./gameboard')
const ship = require('./ships')

describe('place the ship then verify no other coords were modified',()=>{
    const gameBoardTest = gameBoard.GameBoard()
    beforeAll(()=>{
        gameBoardTest.placeShip('destroyer',[30,40])
    })
    test('place the ship at coords',()=>{
        expect(gameBoardTest.shipCoordinates[4].coords).toStrictEqual([30,40])
    })
    test('verify no other ship coords were changed',()=>{
        expect(gameBoardTest.shipCoordinates[0].coords).toStrictEqual([33,43,53,63,73])
    })
})

describe('check if receiveAttack hits ship if so, remove coord and trigger hit function on relevant ship',()=>{
    const testShip = ship.Ship()
    const gameBoardTest = gameBoard.GameBoard()
    test('check if receiveAttack has hit a ship',()=>{
        gameBoardTest.receiveAttack(44,testShip)
        expect(gameBoardTest.missedShots).toStrictEqual([44])
    })
    test('shot taken should be in allShotsTaken array',()=>{
        expect(gameBoardTest.allShotsTaken).toStrictEqual([44])
    })
    test('if receiveAttack hits a ship update hitCount of relevant ship',()=>{
        gameBoardTest.receiveAttack(43,testShip)
        expect(testShip.allShips[0].info.hitCount).toBe(1)
    })
    test('verify that relevant ship coord is removed',()=>{
        expect(gameBoardTest.shipCoordinates[0].coords).toStrictEqual([33,53,63,73])
    })
})

test('verify gameBoard detects when all ships have been sunk',()=>{
    const testShip = ship.Ship()
    const gameBoardTest = gameBoard.GameBoard()
    for(let i=0;i<testShip.allShips.length;i++){
        testShip.allShips[i].sunk = true
    }
    expect(gameBoardTest.isGameOver(testShip)).toBe(true)
})
