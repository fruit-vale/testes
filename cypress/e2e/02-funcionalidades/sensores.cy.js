const NOME = /sensores/i;
const ROTA = '/sensores';

// acha o campo de texto/data pelo rótulo
const campo = (rotulo) =>
  cy.contains('label', rotulo).parent().find('input');

// escolhe a primeira opção válida (select comum ou lista personalizada)
const escolherPrimeira = (rotulo) => {
  cy.contains('label', rotulo)
    .parent()
    .then(($campo) => {
      if ($campo.find('select').length) {
        cy.wrap($campo)
          .find('select option')
          .then(($opcoes) => {
            const valida = [...$opcoes].find((o) => o.value && !o.disabled);
            cy.wrap($campo).find('select').select(valida.value);
          });
      } else {
        cy.wrap($campo)
          .find('button, [role="combobox"], [class*="select"]')
          .first()
          .click();
        cy.get('[role="option"], [class*="option"]').first().click();
      }
    });
};

describe('Sensores', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit(ROTA);
  });

  it('abre a página de sensores', () => {
    cy.location('pathname').should('not.eq', '/login');
    cy.contains(NOME).should('be.visible');
  });

  it('mostra a lista de sensores', () => {
    cy.get('table, [role="table"], ul, [class*="card"]').should('exist');
  });

  it('cadastra um novo sensor', () => {
    // sem espaços: o identificador vira o usuário MQTT do sensor
    const identificador = `sensor-cypress-${Date.now()}`;

    // abre o formulário (nesse momento só existe um botão com esse texto)
    cy.contains('button', /cadastrar sensor/i).click();

    campo(/identificador/i).type(identificador);
    escolherPrimeira(/lote/i);
    campo(/data de instalação/i).type('2026-11-22');

    // dados obrigatórios: atalho de temperatura e umidade
    cy.contains('button', /usar temperatura e umidade/i).click();

    // com o modal aberto existem 2 botões "Cadastrar sensor"; o do modal é o último
    cy.get('button:contains("Cadastrar sensor")').last().click();

    // modal com as credenciais: confere o usuário e continua
    cy.contains(/sensor cadastrado/i).should('be.visible');
    cy.contains(identificador).should('be.visible');
    cy.contains('button', /continuar: configurar a placa/i).click();

    // modal da placa: rola até o fim e conclui
    cy.contains(/configurar a placa no arduino ide/i).should('be.visible');
    cy.contains('button', /^concluir$/i).scrollIntoView().should('be.visible').click();

    // o modal fecha e o sensor novo aparece na lista
    cy.contains(/configurar a placa no arduino ide/i).should('not.exist');
    cy.contains(identificador).should('be.visible');
  });
});