import { Page, Locator, expect } from '@playwright/test';

export class ProjectDetailsPage {
  readonly page: Page;
  readonly createNewSuiteButton: Locator;
  readonly suiteNameInput: Locator;
  readonly createButton: Locator;
  readonly manualTestButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createNewSuiteButton = page.getByRole('button', {
      name: 'Create new suite',
    });

    this.suiteNameInput = page.getByRole('textbox', {
      name: 'Suite name',
    });

    this.createButton = page.getByRole('button', {
      name: 'Create',
      exact: true,
    });

    this.manualTestButton = page.getByRole('button', {
      name: 'Manual test',
    });
  }

  async clickCreateNewSuite() {
    await this.createNewSuiteButton.click();
  }

  async createSuite(suiteName: string) {
    await this.createNewSuiteButton.click();
    await this.suiteNameInput.fill(suiteName);
    await this.createButton.click();
  }

  async clickManualTestButton() {
    await this.manualTestButton.click();
  }

  async expectTestCaseCreatedViaUI(title: string) {
    await expect(this.page.getByText(title).first()).toBeVisible();
  }
}