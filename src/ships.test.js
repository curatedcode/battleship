import ships from './ships'

test('increase hit count on ship if hit',()=>{
    expect(ships.hit(cruiser)).toBe(1)
})