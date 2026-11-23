const NOME = /culturas/i;
const ROTA = '/culturas';

// acha o campo de texto/número pelo rótulo
const campo = (rotulo) =>
  cy.contains('label', rotulo).parent().find('input');

describe('Culturas', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit(ROTA);
  });

  it('abre a página de culturas', () => {
    cy.location('pathname').should('not.eq', '/login');
    cy.contains(NOME).should('be.visible');
  });

  it('mostra a lista de culturas', () => {
    cy.get('table, [role="table"], ul, [class*="card"]').should('exist');
  });

  it('cadastra a cultura Uva Vitória', () => {
    cy.contains('button', /nova cultura/i).click();

    campo(/^cultura|nome/i).first().type('Uva');
    campo(/variedade/i).type('Vitória');
    campo(/temperatura.*m[ií]n/i).type('20');
    campo(/temperatura.*m[aá]x/i).type('30');
    campo(/umidade.*m[ií]n/i).type('20');
    campo(/umidade.*m[aá]x/i).type('30');
    campo(/ciclo/i).type('120');

    cy.contains(
      '[role="dialog"] button, form button, [class*="modal"] button',
      /salvar|cadastrar|criar/i
    ).click();

    // a nova cultura aparece na lista
    cy.contains(/uva.*vit[óo]ria/i).should('be.visible');
  });
});