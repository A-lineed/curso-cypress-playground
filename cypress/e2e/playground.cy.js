describe('template spec', () => {
  beforeEach('', () => {
    cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
  })

  it('Shows a promotional banner', () => {
    cy.get('#promotional-banner').should('be.visible')
  })

  it('Clicks the subscribe button and shows a successs message', () => {
    cy.contains('button', 'Subscribe').click()

    cy.contains('#success', "You've been successfully subscribed to our newsletter.")
      .should('be.visible')
  })

  it('Types in an input which "signs" a form, then asserts it is signed', () => {
    cy.get('#signature-textarea').type('Aline Edvania')

    cy.contains('#signature', 'Aline Edvania').should('be.visible')
  })

  it.only('Types in the signature field, checks the checkbox to see the preview, then unchecks it', () => {
    cy.get('#signature-textarea-with-checkbox').type('Aline Edvania')

    cy.get('#signature-checkbox').check()
      .should('be.checked')

    cy.contains('#signature-triggered-by-check', 'Aline Edvania').should('be.visible')

    cy.get('#signature-checkbox').uncheck()
      .should('not.be.checked')
    
      cy.contains('#signature-triggered-by-check', 'Aline Edvania').should('not.exist')
  })


})