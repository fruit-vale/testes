const NOME = /propriedades/i;
const ROTA = '/propriedades';

// acha o campo de texto pelo rótulo
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
        cy.contains(
          '[role="option"], li, button, [class*="option"], [class*="item"]',
          textoOpcao,
          { timeout: 10000 }
        ).click();
      }
    });
};

// rola a lista aberta até achar a opção e clica nela
const clicarOpcaoRolando = (texto, tentativas = 60) => {
  cy.get('body').then(($body) => {
    const opcoes = $body
      .find('[role="option"], [class*="option"], [class*="item"], li')
      .toArray();
    const alvo = opcoes.find((el) => texto.test(el.textContent.trim()));

    if (alvo) {
      cy.wrap(alvo).scrollIntoView().click();
      return;
    }

    expect(tentativas, 'tentativas de rolagem da lista').to.be.greaterThan(0);

    // acha o contêiner da lista que tem barra de rolagem e desce um pouco
    let contenedor = opcoes[0] && opcoes[0].parentElement;
    while (contenedor && contenedor.scrollHeight <= contenedor.clientHeight) {
      contenedor = contenedor.parentElement;
    }
    if (contenedor) contenedor.scrollTop += 300;

    cy.wait(150).then(() => clicarOpcaoRolando(texto, tentativas - 1));
  });
};

// município: espera habilitar, abre a lista e escolhe a cidade
const escolherMunicipio = (texto) => {
  cy.contains('label', /munic[ií]pio/i)
    .parent()
    .then(($campo) => {
      if ($campo.find('select').length) {
        cy.wrap($campo).find('select').should('not.be.disabled');
        cy.wrap($campo).find('select option').should('have.length.greaterThan', 1);
        cy.wrap($campo)
          .find('select option')
          .then(($opcoes) => {
            const alvo = [...$opcoes].find((o) => texto.test(o.textContent.trim()));
            expect(alvo, 'município').to.exist;
            cy.wrap($campo).find('select').select(alvo.value);
          });
      } else {
        cy.wrap($campo)
          .find('button, [role="combobox"]')
          .first()
          .should('not.be.disabled')
          .click();
        clicarOpcaoRolando(texto);
      }
    });
};

// marca o contorno da propriedade: aproxima e clica nos 4 cantos, fechando no primeiro
const desenharContorno = () => {
  cy.contains('button', /desenhar no mapa/i).click();

  // o mapa já foi até o município escolhido; aproxima mais um pouco
  for (let i = 0; i < 3; i++) {
    cy.get('.leaflet-control-zoom-in:visible').click({ force: true });
    cy.wait(600);
  }

  const mapa = () => cy.get('.leaflet-container:visible').last();
  mapa().click(150, 120, { force: true });
  cy.wait(300);
  mapa().click(300, 120, { force: true });
  cy.wait(300);
  mapa().click(300, 250, { force: true });
  cy.wait(300);
  mapa().click(150, 250, { force: true });
  cy.wait(300);
  mapa().click(150, 120, { force: true }); // fecha o polígono no primeiro ponto
};

describe('Propriedades', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit(ROTA);
  });

  it('abre a página de propriedades', () => {
    cy.location('pathname').should('not.eq', '/login');
    cy.contains(NOME).should('be.visible');
  });

  it('mostra a lista de propriedades', () => {
    cy.get('table, [role="table"], ul, [class*="card"]').should('exist');
  });

  it('cadastra uma nova propriedade', () => {
    const nome = `Fazenda Cypress ${Date.now()}`;

    cy.contains('button', /nova propriedade/i).click();
    cy.contains(/nova propriedade/i).should('be.visible');

    escolherPrimeira(/empresa/i);
    campo(/^nome/i).type(nome);

    // escolhe o estado; o município só habilita depois dele
    escolherPorTexto(/estado/i, /pernambuco/i);

    // escolhe Recife (rola a lista até achar)
    escolherMunicipio(/^recife$/i);

    // confere que o município ficou selecionado
    cy.contains('label', /munic[ií]pio/i).parent().should('contain', 'Recife');

    // espera o mapa ir até a cidade e marca o contorno
    cy.wait(2000);
    desenharContorno();

    cy.contains('button', /cadastrar propriedade/i).click();

    // se o sistema pedir confirmação, confirma
    cy.wait(1500);
    cy.get('body').then(($body) => {
      const confirmar = $body
        .find('[role="dialog"] button, [role="alertdialog"] button')
        .filter((i, el) => /^(confirmar|confirmo|sim|ok|continuar|concluir)/i.test(el.textContent.trim()));
      if (confirmar.length) {
        cy.wrap(confirmar.first()).click();
      }
    });

    // o formulário fecha e a propriedade nova aparece na lista
    cy.contains('button', /cadastrar propriedade/i).should('not.exist');
    cy.contains(nome).should('be.visible');
  });
});