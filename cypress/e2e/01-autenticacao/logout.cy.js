describe('Autenticação - Login', () => {

  const url = 'https://fruitvale.com.br';

  it('faz login com credenciais válidas', () => {
    cy.fixture('usuarios').then(({ admin: { email, senha } }) => {
    cy.visit(url);
    cy.contains('a', 'Entrar na plataforma').should('be.visible').click();
    cy.get('[name="email"]').type(email);
    cy.get('[name="senha"]').type(senha);
    cy.get('button[type="submit"]').click();
    cy.contains('[data-sidebar="menu-button"]', 'Sair').click();
    cy.location('pathname').should('match', /^\/(login)?$/);
    });
  });
});