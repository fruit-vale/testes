// Login via API (mais rápido que pela UI)
Cypress.Commands.add('login', (perfil = 'admin') => {
  cy.fixture('usuarios').then((u) => {
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, u[perfil]).then(({ body }) => {
      window.localStorage.setItem('token', body.access_token);
    });
  });
});

// Login pela interface
Cypress.Commands.add('loginUI', (email, senha) => {
  cy.visit('/login');
  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=senha]').type(senha, { log: false });
  cy.get('[data-cy=entrar]').click();
});

Cypress.Commands.add('loginAdmin', () => {
  cy.session('admin', () => {
    cy.fixture('usuarios').then(({ admin }) => {
      cy.visit('/login');
      cy.get('[name="email"]').type(admin.email);
      cy.get('[name="senha"]').type(admin.senha, { log: false });
      cy.get('button[type="submit"]').click();
      cy.location('pathname').should('not.eq', '/login');
    });
  });
});