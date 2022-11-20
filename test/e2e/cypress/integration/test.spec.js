describe('Opioner GUI app', () => {
    context('Basic Home page test', () => {

        before(() => {

            cy.visit(Cypress.config('baseUrl'))
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
            cy.get('button').contains('Login');
            cy.get('button').contains('Create New Account');
			cy.get('a').contains('Sign up!');
			cy.get('a').contains('Check Status ?');
			cy.get('a').contains('Contact Us');
        })

    })
})