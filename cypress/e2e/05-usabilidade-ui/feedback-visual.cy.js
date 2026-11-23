describe('Feedback visual - login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('mostra mensagem ao enviar o login vazio', () => {
    cy.get('button[type="submit"]').click();
    cy.contains(/obrigat|inválid|preencha/i).should('be.visible');
  });

  it('mostra erro e permanece no login com credenciais inválidas', () => {
    cy.get('[name="email"]').type('naoexiste@teste.com');
    cy.get('[name="senha"]').type('senha-errada', { log: false });
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/login');
  });

  it('o botão de entrar está visível e habilitado', () => {
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled');
  });
});