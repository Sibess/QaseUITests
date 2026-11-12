import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly headerNav: Locator;
  readonly cookiesDialog: Locator;
  readonly platformButton: Locator;
  readonly solutionsButton: Locator;
  readonly resourcesButton: Locator;
  readonly pricingLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerNav = page.getByRole('navigation');
    this.cookiesDialog = page.getByRole('dialog', { name: 'Privacy Settings' });

    this.platformButton = this.headerNav.getByRole('button', {
      name: 'Platform',
      exact: true,
    });

    this.solutionsButton = this.headerNav.getByRole('button', {
      name: 'Solutions',
      exact: true,
    });

    this.resourcesButton = this.headerNav.getByRole('button', {
      name: 'Resources',
      exact: true,
    });

    this.pricingLink = this.headerNav.getByRole('link', {
      name: 'Pricing',
      exact: true,
    });
  }

  async gotoBaseURL() {
    await this.page.goto(process.env.QASE_BASE_URL!);
  }

  async expectHeaderLinksVisible() {
    await expect(this.platformButton).toBeVisible();
    await expect(this.solutionsButton).toBeVisible();
    await expect(this.resourcesButton).toBeVisible();
    await expect(this.pricingLink).toBeVisible();
  }

  async acceptCookies() {
    await this.cookiesDialog.getByRole('button', { name: 'Accept' }).click();
  }

async expectCookiesDialogVisible() {
  await expect(this.cookiesDialog).toBeVisible();
}

async expectCookiesDialogHidden() {
  await expect(this.cookiesDialog).toBeHidden();
}
}