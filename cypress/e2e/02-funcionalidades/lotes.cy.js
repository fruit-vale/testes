const NOME = /cultivos|lotes/i;
const ROTA = '/cultivos';

// acha o campo de texto/data/número pelo rótulo
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

// escolhe a opção pelo texto (select comum ou lista personalizada)
const escolherPorTexto = (rotulo, textoOpcao) => {
  cy.contains('label', rotulo)
    .parent()
    .then(($campo) => {
      if ($campo.find('select').length) {
        cy.wrap($campo)
          .find('select option')
          .then(($opcoes) => {
            const alvo = [...$opcoes].find((o) => textoOpcao.test(o.textContent));
            expect(alvo, `opção ${textoOpcao}`).to.exist;
            cy.wrap($campo).find('select').select(alvo.value);
          });
      } else {
        cy.wrap($campo)
          .find('button, [role="combobox"], [class*="select"]')
          .first()
          .click();
        cy.contains('[role="option"], li, button, [class*="option"]', textoOpcao).click();
      }
    });
};

// desenha o lote no mapa: aproxima e clica nos 4 cantos, fechando no primeiro
const desenharLoteNoMapa = () => {
  cy.contains('button', /desenhar no mapa/i).click();

  for (let i = 0; i < 10; i++) {
    cy.get('.leaflet-control-zoom-in').click({ force: true });
    cy.wait(400);
  }

  const mapa = () => cy.get('.leaflet-container:visible').last();
  mapa().click(150, 150);
  mapa().click(300, 150);
  mapa().click(300, 280);
  mapa().click(150, 280);
  mapa().click(150, 150); // fecha o polígono no primeiro ponto
};

// todo card de lote tem o botão "Histórico", com ou sem mapa
const SELETOR_CARD = 'button:contains("Histórico")';

describe('Cultivos e lotes', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/lotes').as('lotes');
    cy.loginAdmin();
    cy.visit(ROTA);
  });

  it('abre a página de cultivos e lotes', () => {
    cy.location('pathname').should('not.eq', '/login');
    cy.contains(NOME).should('be.visible');
  });

  it('mostra a lista de cultivos e lotes', () => {
    cy.get('table, [role="table"], ul, [class*="card"]').should('exist');
  });

  it('cadastra um novo lote de Manga Tommy Atkins marcado no mapa', () => {
    // espera a lista carregar para contar certo (pode ser zero lotes)
    cy.wait('@lotes');
    cy.wait(1000);

    cy.get('body').then(($body) => {
      const antes = $body.find(SELETOR_CARD).length;

      cy.contains('button', /novo lote/i).click();
      cy.contains(/novo lote/i).should('be.visible');

      // a identificação é preenchida pelo sistema (somente leitura)
      campo(/identificação/i).should('have.attr', 'readonly');

      escolherPorTexto(/propriedade/i, /vale verde/i);
      escolherPorTexto(/cultura/i, /manga.*tommy/i);
      campo(/data de plantio/i).type('2026-11-22');

      // a previsão de colheita pode ser calculada sozinha ou ficar liberada:
      // se estiver bloqueada, confere que veio preenchida; se não, digita
      cy.wait(500);
      campo(/previsão de colheita/i).then(($input) => {
        if ($input.is(':disabled') || $input.attr('readonly')) {
          cy.wrap($input).should('not.have.value', '');
        } else {
          cy.wrap($input).clear().type('2027-03-22');
        }
      });

      desenharLoteNoMapa();

      // garante a área mesmo se o contorno não for registrado
      campo(/área \(ha\)/i).type('2');

      cy.contains('button', /cadastrar lote/i).click();

      // abre o modal do lote novo ("Lote N — Propriedade"); fecha pelo X no topo
      cy.contains(/lote \d+ — /i).should('be.visible');
      cy.get('[role="dialog"]').last().then(($dialogo) => {
        const x = $dialogo.find(
          '[data-slot="dialog-close"], button[aria-label*="echar"], button[aria-label*="lose"]'
        );
        cy.wrap(x.length ? x.first() : $dialogo.find('button').first()).click();
      });

      // o modal fecha e a lista ganha um lote
      cy.contains(/lote \d+ — /i).should('not.exist');
      cy.get(SELETOR_CARD).should('have.length', antes + 1);
    });
  });
});