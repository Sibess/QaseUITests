import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/authentication/Login';
import { ProjectsPage } from '../../pages/projects/Projects';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;
  let projectsPage: ProjectsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    projectsPage = new ProjectsPage(page);
    await loginPage.openLoginPage();
  });

  test('should login into the account', async () => {
    await loginPage.login();
    await projectsPage.isUserLoggedIn();
  });

  test('should not login with invalid credentials', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/v1/auth/login/regular') &&
        response.request().method() === 'POST'
    );

    await loginPage.loginWithCredentials('invalid@email.com', 'wrongPassword123');

    const response = await responsePromise;
    expect(response.status()).toBe(401);

    await expect(loginPage.invalidCredentialsError).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });
});