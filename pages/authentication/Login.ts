import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly invalidCredentialsError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Work email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.invalidCredentialsError = page
      .getByText(/These credentials do not match our records\./)
      .first();
  }

async openLoginPage() {
  await this.page.goto(process.env.QASE_BASE_URL!);

  const acceptButton = this.page.getByRole('button', { name: 'Accept' });

  if (await acceptButton.isVisible({ timeout: 5000 })) {
    await acceptButton.click();
  }

  await this.page.getByRole('link', { name: 'Login' }).click();
}

  async login() {
    await this.emailInput.fill(process.env.QASE_EMAIL!);
    await this.passwordInput.fill(process.env.QASE_PASSWORD!);
    await this.signInButton.click();
  }

  async loginWithCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}