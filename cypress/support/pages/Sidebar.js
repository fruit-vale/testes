export function abrirGrupo(nome) {
  cy.contains('button[aria-expanded]', nome).then(($botao) => {
    if ($botao.attr('aria-expanded') === 'false') {
      cy.wrap($botao).click();
    }
  });
  cy.contains('button[aria-expanded]', nome).should('have.attr', 'aria-expanded', 'true');
}

export function irPara(rota, grupo) {
  if (grupo) abrirGrupo(grupo);
  cy.get(`[data-sidebar="menu-button"][href="/${rota}"]`).click();
  cy.location('pathname').should('eq', `/${rota}`);
}

export function sair() {
  cy.contains('[data-sidebar="menu-button"]', 'Sair').click();
}