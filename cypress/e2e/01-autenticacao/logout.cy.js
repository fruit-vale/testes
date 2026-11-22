describe('Autenticação - Login', () => {

  const url = 'https://fruitvale.com.br';

  it('faz login com credenciais válidas', () => {
    cy.visit(url);
    cy.contains('a', 'Entrar na plataforma').should('be.visible').click();
    cy.get('[name="email"]').type('admin@fruitvale.com.br');
    cy.get('[name="senha"]').type('admin0@');
    cy.get('button[type="submit"]').click();
    cy.contains('[data-sidebar="menu-button"]', 'Sair').click();
  });
});