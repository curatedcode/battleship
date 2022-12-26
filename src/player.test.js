const playerModule = require('./player')

describe('sendAttack to opponents board',()=>{
    const playerOne = playerModule.Player()
    const playerTwo = playerModule.Player()
    beforeAll(()=>{
        playerOne.sendAttack(29,playerTwo.gameBoard,playerTwo.ships)
    })
    test('sendAttack to opponents board',()=>{
        expect(playerTwo.gameBoard.shipCoordinates[4].coords).toStrictEqual([39])
    })
    test('verify playerOne gameBoard did not get modified',()=>{
        expect(playerOne.gameBoard.shipCoordinates[4].coords).toStrictEqual([29,39])
    })
})

test('generate a random move thats has not been played before',()=>{
    const computerTest = playerModule.Player()
    const randomCoord = computerTest.computer.randomCoord()
    expect(computerTest.computer.usedMoves).toStrictEqual([randomCoord])
})

