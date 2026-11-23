const NOME = /alertas|leituras/i;
const ROTA = '/leituras-alertas';

describe('Leituras e alertas climáticos', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit(ROTA);
  });

  it('abre a página de leituras e alertas', () => {
    cy.location('pathname').should('not.eq', '/login');
    cy.contains(NOME).should('be.visible');
  });

  it('mostra a lista de leituras e alertas', () => {
    cy.get('table, [role="table"], ul, [class*="card"]').should('exist');
  });
});