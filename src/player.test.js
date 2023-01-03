const playerModule = require('./player')

test('send attack to opponents board',()=>{
    const playerOne = playerModule.Player()
    const playerTwo = playerModule.Player()
    playerOne.sendAttack(16,playerTwo.gameBoard,playerTwo.ships)
    expect(playerTwo.ships.allShips[4].info.hitCount).toBe(1)
})

test('generate a random move thats has not been played before',()=>{
    const computerTest = playerModule.Player()
    const randomCoord = computerTest.computer.randomCoord()
    expect(computerTest.computer.usedMoves).toStrictEqual([randomCoord])
})

