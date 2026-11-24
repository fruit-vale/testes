import { API_URL } from './constantes';
import { obterCredenciais } from './pages/LoginPage';

// Faz login pela API e devolve o token JWT
export function obterToken(perfil = 'admin') {
  return obterCredenciais(perfil).then(({ email, senha }) =>
    cy
      .request({
        method: 'POST',
        url: `${API_URL}/auth/login`,   // confirmar a rota
        body: { email, senha },          // confirmar os nomes dos campos
        log: false,
      })
      .its('body.access_token')          // confirmar o nome do campo do token
  );
}

// Chamada autenticada; não falha em 4xx/5xx para podermos testar erros
export function api(method, rota, token, body) {
  return cy.request({
    method,
    url: `${API_URL}${rota}`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
    failOnStatusCode: false,
  });
}