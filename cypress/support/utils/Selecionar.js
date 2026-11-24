// Abre um combobox do Base UI e escolhe uma opção
// id: o id do combobox (ex.: 'role', 'empresa')
// texto: o texto da opção; se omitido, escolhe a primeira disponível
export function selecionar(id, texto) {
  cy.get(`#${id}`).click().should('have.attr', 'aria-expanded', 'true');

  const opcoes = () =>
    cy.get('[role="option"]:visible').not('[data-disabled]');

  if (texto) {
    opcoes().contains(texto).click();
  } else {
    opcoes().first().click();
  }

  cy.get(`#${id}`).should('have.attr', 'aria-expanded', 'false');
}