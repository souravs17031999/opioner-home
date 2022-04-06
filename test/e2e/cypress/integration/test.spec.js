describe('Opioner GUI app', () => {
    context('Basic test', () => {

        before(() => {

            cy.intercept('GET', 'https://www.facebook.com/**', {
                statusCode: 200
            }).as('fbStatus')

            cy.intercept('GET', 'https://apis.google.com/**', {
                statusCode: 200
            }).as('GStatus')

            cy.visit(Cypress.config('baseUrl'))
            cy.wait('@fbStatus')
            cy.wait('@GStatus')
        })
          
        it('test #1', () => {
            cy.contains('Login')
        })
        
        it('test #2', () => {
            cy.contains('Login')
        })

    })
})