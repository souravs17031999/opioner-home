describe('Opioner GUI app', () => {
    context('Basic Home page test', () => {

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
          
        it('test #1: Basic components test', () => {
            cy.get('custom-single-header').should('have.length', 1);
            cy.get('custom-landing-intro-section').should('have.length', 5);
            cy.get('login-container').should('have.length', 1);
            cy.get('custom-footer').should('have.length', 1);
            cy.get('a').contains('Login');
            cy.get('a').contains('Signup');
            cy.get('a').contains('Sign up!');
            cy.get('a').contains('Check Status ?');
            cy.get('a').contains('Contact Us');
            cy.get('form');
            cy.get('h1').contains('Sign in');
            cy.get('.username-container').find('label').contains('Username');
            cy.get('.password-outer-container').find('label').contains('Password');
            cy.get('button').contains('Login');
            cy.get('a').contains('Forgotten password?');
            cy.get('button').contains('Create New Account');
        })

    })
})