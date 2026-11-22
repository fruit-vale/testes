import { fazerLogin } from '../../support/pages/LoginPage';

describe('Dashboard', () => {
  it('carrega após o login', () => {
    fazerLogin('admin');
  });
});