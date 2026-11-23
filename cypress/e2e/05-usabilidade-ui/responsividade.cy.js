describe('Responsividade - login', () => {
  const telas = [
    { nome: 'celular', largura: 375, altura: 667 },
    { nome: 'tablet', largura: 768, altura: 1024 },
    { nome: 'desktop', largura: 1366, altura: 768 },
  ];

  telas.forEach(({ nome, largura, altura }) => {
    describe(nome, () => {
      beforeEach(() => {
        cy.viewport(largura, altura);
        cy.visit('/login');
      });

      it('não tem rolagem horizontal', () => {
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.lte(largura);
        });
      });

      it('mostra os campos e o botão', () => {
        cy.get('[name="email"]').should('be.visible');
        cy.get('[name="senha"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
      });
    });
  });
});