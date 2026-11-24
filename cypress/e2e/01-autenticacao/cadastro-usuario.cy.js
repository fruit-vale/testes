import { fazerLogin } from '../../support/pages/LoginPage';
import { irPara } from '../../support/pages/Sidebar';
import { gerarCpf } from '../../support/utils/gerarCpf';
import { selecionar } from '../../support/utils/selecionar';

function novoUsuario() {
  const id = Date.now();
  return {
    nome: `Usuário Teste ${id}`,
    email: `teste.${id}@fruitvale.test`,
    cpf: gerarCpf(),
    telefone: '87999990000',
    senha: 'Senha@123',
    perfil: 'Analista',
  };
}

function preencherFormulario(u) {
  cy.get('#nome').type(u.nome);
  cy.get('#email').type(u.email);
  cy.get('#cpf').type(u.cpf);
  cy.get('#telefone').type(u.telefone);
  cy.get('#senha').type(u.senha, { log: false });

  selecionar('role', u.perfil);
  selecionar('empresa');
}

function salvar() {
  cy.contains('button[type="submit"]', 'Cadastrar usuário').click();
}

describe('Cadastro de usuários', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/usuarios').as('criarUsuario');
    fazerLogin('admin');
    irPara('usuarios', 'Cadastros');
    cy.contains('button', 'Novo usuário').click();
  });

  it('cadastra usuário com dados válidos', () => {
    const u = novoUsuario();

    preencherFormulario(u);
    salvar();

    cy.wait('@criarUsuario').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.get('[data-sonner-toast]').should('be.visible');
    cy.contains(u.email).should('be.visible'); // aparece na lista
  });

  it('valida campos obrigatórios', () => {
    salvar();

    // Campos com "required" são bloqueados pelo próprio navegador
    cy.get('#nome').then(($el) => expect($el[0].validity.valueMissing).to.be.true);
    cy.get('@criarUsuario.all').should('have.length', 0);
  });

  it('impede e-mail duplicado', () => {
    const u = novoUsuario();

    preencherFormulario(u);
    salvar();
    cy.wait('@criarUsuario');

    // Segundo cadastro com o mesmo e-mail e outro CPF
    cy.contains('button', 'Novo usuário').click();
    preencherFormulario({ ...u, nome: `${u.nome} 2`, cpf: gerarCpf() });
    salvar();

    cy.wait('@criarUsuario').its('response.statusCode').should('be.oneOf', [400, 409]);
    cy.get('[data-sonner-toast]').should('be.visible');
  });
});