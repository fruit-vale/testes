// ---------- Page Object da tela de login ----------
export class LoginPage {
  visitar() {
    cy.visit('/login');
  }

  campoEmail() {
    return cy.get('[name="email"]');
  }

  campoSenha() {
    return cy.get('[name="senha"]');
  }

  botaoEntrar() {
    return cy.get('button[type="submit"]');
  }

  notificacao() {
    return cy.get('[data-sonner-toast]');
  }

  entrar(email, senha) {
    if (email) this.campoEmail().clear().type(email, { log: false });
    if (senha) this.campoSenha().clear().type(senha, { log: false });
    this.botaoEntrar().click();
  }
}

const loginPage = new LoginPage();

// ---------- Lê as credenciais do cypress.env.json ----------
// ---------- Lê as credenciais do fixtures/usuarios.json ----------
// perfil: 'admin', 'analista', 'produtor' ou 'inativo'
export function obterCredenciais(perfil = 'admin') {
  return cy.fixture('usuarios').then((usuarios) => {
    const credenciais = usuarios[perfil];

    if (!credenciais?.email || !credenciais?.senha) {
      throw new Error(`Credenciais de "${perfil}" não encontradas em fixtures/usuarios.json`);
    }

    return { email: credenciais.email, senha: credenciais.senha };
  });
}

// ---------- Login com e-mail e senha informados ----------
export function fazerLoginCom(email, senha) {
  loginPage.visitar();
  loginPage.entrar(email, senha);
}

// ---------- Login com um perfil do cypress.env.json ----------
export function fazerLogin(perfil = 'admin') {
  obterCredenciais(perfil).then(({ email, senha }) => {
    fazerLoginCom(email, senha);
  });

  cy.location('pathname').should('not.eq', '/login');
}