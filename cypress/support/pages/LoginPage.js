export function fazerLogin(perfil = 'admin') {
  cy.fixture('usuarios').then((usuarios) => {
    const { email, senha } = usuarios[perfil];

    cy.visit('/login');
    cy.get('[name="email"]').type('admin@fruitvale.com.br');
    cy.get('[name="senha"]').type('admin0@', { log: false });
    cy.get('button[type="submit"]').click();
  });

  cy.location('pathname').should('not.eq', '/login');
}