import { Page, Locator, expect } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly headerNav: Locator;
  readonly cookiesDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerNav = page.getByRole('navigation');
    this.cookiesDialog = page.getByRole('dialog', { name: 'Privacy Settings' });
  }

  async gotoBaseURL() {
    await this.page.goto(process.env.QASE_BASE_URL!);
  }

  async expectHeaderLinksVisible() {
    await expect(this.headerNav.getByRole('link', { name: 'AI Testing' })).toBeVisible();
    await expect(this.headerNav.getByText('Resources', { exact: true })).toBeVisible();
    await expect(this.headerNav.getByRole('link', { name: 'Platform' })).toBeVisible();
    await expect(this.headerNav.getByRole('link', { name: 'Enterprise' })).toBeVisible();
    await expect(this.headerNav.getByRole('link', { name: 'Pricing' })).toBeVisible();
  }

  async acceptCookies() {
    await this.cookiesDialog.getByRole('button', { name: 'Accept' }).click();
  }

  async expectCookiesDialogVisible() {
    await expect(this.cookiesDialog.getByText('Privacy Settings This site uses third-party website')).toBeVisible();
  }

  async expectCookiesDialogHidden() {
    await expect(this.cookiesDialog.getByText('Privacy Settings This site uses third-party website')).toBeHidden();
  }
}