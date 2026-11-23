const NOME = /relat[óo]rios/i;
const ROTA = '/relatorios';

describe('Relatórios', () => {
  beforeEach(() => {
    cy.loginAdmin();
  });

  it('abre a página de relatórios pelo menu lateral', () => {
    cy.visit('/');
    // o grupo "Análise" pode estar fechado: abre se o item não estiver visível
    cy.get('body').then(($body) => {
      const item = $body.find('a:contains("Relatórios"), button:contains("Relatórios")');
      if (!item.length || !item.is(':visible')) {
        cy.contains(/^análise$/i).click();
      }
    });
    cy.contains('a, button', /^relatórios$/i).click();
    cy.location('pathname').should('eq', ROTA);
    cy.contains('h1, h2', NOME).should('be.visible');
  });

  it('mostra os filtros do relatório', () => {
    cy.visit(ROTA);
    cy.contains(/^relatório$/i).should('be.visible');
    cy.contains(/^lote$/i).should('be.visible');
    cy.contains(/período das leituras e alertas/i).should('be.visible');
    cy.contains('button', /gerar relatório/i).should('be.visible');
  });

  it('gera o relatório com os filtros padrão', () => {
    cy.visit(ROTA);

    // os filtros já vêm preenchidos: Lote, Lote 1 e Últimos 30 dias
    cy.contains('button', /gerar relatório/i).click();

    // depois de gerar, aparecem as opções de download
    cy.contains('button, a', /baixar|pdf|csv/i, { timeout: 10000 }).should('be.visible');
  });
});