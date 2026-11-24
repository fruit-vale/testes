import { API_URL } from '../../support/constantes';
import { obterCredenciais } from '../../support/pages/LoginPage';

describe('API - Auth', () => {
  it('login válido retorna token e dados do usuário', () => {
  obterCredenciais('admin').then(({ email, senha }) => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/auth/login`,
      body: { email, senha },
      log: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.access_token).to.be.a('string').and.match(/^eyJ/);

      expect(res.body.usuario).to.include.keys('id', 'nome', 'email', 'role', 'empresa');
      expect(res.body.usuario.email).to.eq(email);
      expect(res.body).to.not.have.nested.property('usuario.senha'); // nunca devolver a senha
    });
  });
});

  it('senha errada retorna 401', () => {
    obterCredenciais('admin').then(({ email }) => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/auth/login`,
        body: { email, senha: 'senha-errada-123' },
        failOnStatusCode: false,
      }).its('status').should('eq', 401);
    });
  });
});