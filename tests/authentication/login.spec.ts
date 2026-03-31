import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/authentication/Login';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
  });

  test('should login into the account', async () => {
    await loginPage.login();
    await loginPage.isUserLoggedIn();
  });
});