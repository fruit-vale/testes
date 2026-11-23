describe('Navegação - login', () => {
  it('abre a tela de login pela URL', () => {
    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');
  });

  it('permite enviar o formulário com a tecla Enter', () => {
    cy.visit('/login');
    cy.get('[name="email"]').type('naoexiste@teste.com');
    cy.get('[name="senha"]').type('senha-errada{enter}', { log: false });
    cy.location('pathname').should('eq', '/login');
  });

  it('permite focar os campos em sequência', () => {
    cy.visit('/login');
    cy.get('[name="email"]').focus().should('have.focus');
    cy.get('[name="senha"]').focus().should('have.focus');
  });

  it('o botão voltar do navegador funciona', () => {
    cy.visit('/login');
    cy.visit('/');
    cy.go('back');
    cy.location('pathname').should('eq', '/login');
  });
});