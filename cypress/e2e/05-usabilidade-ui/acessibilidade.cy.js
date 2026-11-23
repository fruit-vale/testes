describe('Acessibilidade - login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('a página tem idioma definido', () => {
    cy.get('html').should('have.attr', 'lang');
  });

  it('a página tem título', () => {
    cy.title().should('not.be.empty');
  });

  it('os campos têm rótulo ou texto de ajuda', () => {
    ['email', 'senha'].forEach((nome) => {
      cy.get(`[name="${nome}"]`).then(($campo) => {
        const temRotulo =
          $campo.attr('aria-label') ||
          $campo.attr('placeholder') ||
          $campo.attr('id');
        expect(temRotulo, `rótulo do campo ${nome}`).to.exist;
      });
    });
  });

  it('as imagens têm texto alternativo', () => {
    cy.get('body').then(($body) => {
      if ($body.find('img').length) {
        cy.get('img').each(($img) => {
          expect($img).to.have.attr('alt');
        });
      }
    });
  });
});