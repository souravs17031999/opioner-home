describe('Unit test our math functions', () => {
    context('math', () => {
      it('can add numbers', () => {
        expect(add(1, 2)).to.eq(3)
      })
  
      it('can subtract numbers', () => {
        expect(subtract(5, 12)).to.eq(-7)
      })
  
      specify('can divide numbers', () => {
        expect(divide(27, 9)).to.eq(3)
      })
  
      specify('can multiply numbers', () => {
        expect(multiply(5, 4)).to.eq(20)
      })
    })
})