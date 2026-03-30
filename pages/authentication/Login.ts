import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Work email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
  }

  async openLoginPage() {
    await this.page.goto(process.env.QASE_BASE_URL!);
    await this.page.getByRole('button', { name: 'Accept' }).click();
    await this.page.getByRole('link', { name: 'Log in' }).click();
  }

  async login() {
    await this.emailInput.fill(process.env.QASE_EMAIL!);
    await this.passwordInput.fill(process.env.QASE_PASSWORD!);
    await this.loginButton.click();
  }

  async isUserLoggedIn() {
    await expect(this.page).toHaveURL(/.*projects/);
    await expect(this.page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Create new project' })).toBeVisible();
  }
}