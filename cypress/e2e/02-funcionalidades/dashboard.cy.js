const ROTA = '/mercado';

describe('Dashboard - mercado', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit(ROTA);
  });

  it('abre a página depois do login', () => {
    cy.location('pathname').should('eq', ROTA);
    cy.get('body').should('be.visible');
  });

  it('mostra indicadores ou gráficos', () => {
    cy.get('canvas, svg, table, [class*="card"], [class*="chart"]').should('exist');
  });
});