const ROTA = '/empresas';

// TROQUE por um e-mail seu: o contrato será enviado para ele
const EMAIL_RESPONSAVEL = 'seu.email@exemplo.com';

// gera um CNPJ válido e diferente a cada execução
const gerarCnpj = () => {
  const base = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).concat([0, 0, 0, 1]);
  const digito = (nums) => {
    const pesos = nums.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const resto = nums.reduce((soma, n, i) => soma + n * pesos[i], 0) % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const d1 = digito(base);
  const d2 = digito([...base, d1]);
  return [...base, d1, d2].join('');
};

// acha o campo de texto pelo rótulo
const campo = (rotulo) =>
  cy.contains('label', rotulo).parent().find('input');

// funciona com select comum e com lista personalizada
const escolher = (rotulo, opcao) => {
  cy.contains('label', rotulo)
    .parent()
    .then(($campo) => {
      if ($campo.find('select').length) {
        cy.wrap($campo).find('select').select(opcao);
      } else {
        cy.wrap($campo)
          .find('button, [role="combobox"], [class*="select"]')
          .first()
          .click();
        cy.contains(
          '[role="option"], li, button, [class*="option"], [class*="item"]',
          opcao
        ).click();
      }
    });
};

describe('Empresas', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit(ROTA);
  });

  it('abre a página de empresas', () => {
    cy.location('pathname').should('not.eq', '/login');
    cy.contains(/empresas/i).should('be.visible');
  });

  it('abre o formulário de nova empresa', () => {
    cy.contains('button', /nova empresa/i).click();
    cy.contains(/razão social/i).should('be.visible');
  });

  it('cadastra uma nova empresa', () => {
    const razaoSocial = `Empresa Teste Cypress ${Date.now()}`;

    // monitora a chamada que carrega os municípios (IBGE)
    cy.intercept('GET', '**/localidades/estados/*/municipios*').as('municipios');

    cy.contains('button', /nova empresa/i).click();

    campo(/razão social/i).type(razaoSocial);
    campo(/cnpj/i).type(gerarCnpj());
    campo(/responsável/i).first().type('Responsável Teste');
    campo(/e-mail/i).type(EMAIL_RESPONSAVEL);
    campo(/telefone/i).type('81999999999');

    // o município só habilita depois de escolher o estado
    escolher(/estado/i, 'Pernambuco');
    cy.wait('@municipios');

    cy.contains('label', /munic[ií]pio/i)
      .parent()
      .find('button, [role="combobox"]')
      .first()
      .should('not.be.disabled')
      .click();

    cy.contains('Recife', { timeout: 10000 }).click();

    cy.contains('button', /cadastrar e enviar contrato/i).click();

    // o formulário fecha e a empresa nova aparece na lista
    cy.contains('button', /cadastrar e enviar contrato/i).should('not.exist');
    cy.contains(razaoSocial).should('be.visible');
  });
});