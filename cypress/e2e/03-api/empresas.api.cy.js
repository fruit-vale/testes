import { obterToken, api } from '../../support/api';

describe('API - Empresas', () => {
  it('GET /empresas com token retorna 200 e uma lista', () => {
    obterToken('admin').then((token) => {
      api('GET', '/empresas', token).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
        if (res.body.length) {
          expect(res.body[0]).to.have.property('id');
        }
      });
    });
  });

  it('GET /empresas sem token retorna 401', () => {
    api('GET', '/empresas').its('status').should('eq', 401);
  });

  it('analista não pode criar empresa (403)', () => {
    obterToken('analista').then((token) => {
      api('POST', '/empresas', token, { nome: 'Teste' })
        .its('status').should('eq', 403);
    });
  });
});