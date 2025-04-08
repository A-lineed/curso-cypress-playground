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

  it('Types in the signature field, checks the checkbox to see the preview, then unchecks it', () => {
    cy.get('#signature-textarea-with-checkbox').type('Aline Edvania')

    cy.get('#signature-checkbox').check()
      .should('be.checked')

    cy.contains('#signature-triggered-by-check', 'Aline Edvania').should('be.visible')

    cy.get('#signature-checkbox').uncheck()
      .should('not.be.checked')

    cy.contains('#signature-triggered-by-check', 'Aline Edvania').should('not.exist')
  })

  it('Check both possible radios and asserts if it is "on" or "off"', () => {

    cy.contains('#on-off', 'ON').should('be.visible')

    cy.get('#off').check()

    cy.contains('#on-off', 'OFF').should('be.visible')
    cy.contains('#on-off', 'ON').should('not.exist')

    cy.get('#on').check()

    cy.contains('#on-off', 'ON').should('be.visible')
    cy.contains('#on-off', 'OFF').should('not.exist')

  })

  it('Selects a type via the dropdown field and asserts on the selection', () => {
    cy.contains('#select-selection', "You haven't selected a type yet.").should('be.visible')

    cy.get('#selection-type').select('VIP')

    cy.contains('#select-selection', 'VIP').should('be.visible')

    cy.get('#selection-type').select('vip')

    cy.contains('#select-selection', 'VIP').should('be.visible')

    cy.get('#selection-type').select(3)

    cy.contains('#select-selection', 'VIP').should('be.visible')
  })

  it('Selects multiple fruits via the dropdown field and asserts on the selection', () => {
    cy.contains('#fruits-paragraph', "You haven't selected any fruit yet.").should('be.visible')

    cy.get('#fruit').select(['Apple', 'Banana', 'Cherry'])
    cy.contains('#fruits-paragraph', "You've selected the following fruits: apple, banana, cherry")
      .should('be.visible')

    cy.contains('#fruits-paragraph', "You haven't selected any fruit yet.").should('not.exist')
  })

  it.only('Uploads a file and asserts the corect file name appears as a paragraph', () => {
    cy.get('#file-upload').selectFile('./cypress/fixtures/example.json')

    cy.contains('#file', 'The following file has been selected for upload: example.json').should('be.visible')
  })

  
})