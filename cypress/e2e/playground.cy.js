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

  it('Uploads a file and asserts the corect file name appears as a paragraph', () => {
    cy.get('#file-upload').selectFile('./cypress/fixtures/example.json')

    cy.contains('#file', 'The following file has been selected for upload: example.json').should('be.visible')
  })

  it('Click a button and triggers a request', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', 'TODO ID: 1').should('be.visible')
    cy.contains('li', 'Title: delectus aut autem').should('be.visible')
    cy.contains('li', 'Completed: false').should('be.visible')
    cy.contains('li', 'User ID: 1').should('be.visible')

  })

  it('Clicks a button and triggers a stubbed request', () => {
    const todo = require('../fixtures/todo.json')

    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', { fixture: 'todo' }).as('getTodo')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', `TODO ID: ${todo.id}`).should('be.visible')
    cy.contains('li', `Title: ${todo.title}`).should('be.visible')
    cy.contains('li', `Completed: ${todo.completed}`).should('be.visible')
    cy.contains('li', `User ID: ${todo.userId}`).should('be.visible')

  })

  it('Clicks a button and simulates an API failure', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', {
      statusCode: 500
    }).as('serverFailure')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@serverFailure')
      .its('response.statusCode')
      .should('be.equal', 500)

    cy.contains(
      'span',
      'Oops, something went wrong. Refresh the page and try again.'
    ).should('be.visible')
  })

  it('Clicks a button and simulates a network failure', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', {
      forceNetworkError: true
    }).as('networkError')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@networkError')

    cy.contains(
      'span',
      'Oops, something went wrong. Check your internet connection, refresh the page, and try again.'
    ).should('be.visible')

  })

  it('Makes an HTTP request and asserts oh the returned astatus code', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .its('status')
      .should('be.equal', 200)

    cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .its('body')
      .should('have.property', 'title')
      .and('eq', 'delectus aut autem')

    cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .its('body')
      .should('have.property', 'completed')
      .and('eq', false)

  });

  Cypress._.times(10, index => {
    it(`Selects ${index + 1} out of 10`, () => {
      cy.get('#level')
        .invoke('val', index + 1)
        .trigger('change')

      cy.contains('p', `You're on level: ${index + 1}`).should('be.visible')
    })
  })

  it('Selects a date and asserts the correct date has been displayed', () => {
    cy.get('#date').type('2025-04-10').blur()

    cy.contains('p', "The date you've selected is: 2025-04-10").should('be.visible')
  })


  it('Types a password based on a protected variable', () => {
    cy.get('#password')
      .type(Cypress.env('password'), { log: false })

    cy.get('#show-password-checkbox').check()

    cy.get('#password-input input[type="password"]').should('not.exist')
    cy.get('#password-input input[type="text"]')
      .should('be.visible')
      .and('have.value', Cypress.env('password'), { log: false })

    cy.get('#show-password-checkbox').uncheck()

    cy.get('#password-input input[type="password"]').should('be.visible')
    cy.get('#password-input input[type="text"]').should('not.exist')
  })

  it('Counts the number of animals in a list', () => {
    cy.get('ul#animals li').should('have.length', 5)
  })


})