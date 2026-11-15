import { Page, Locator, expect } from '@playwright/test';

export class ProjectPage {
  readonly page: Page;
  readonly createNewSuiteButton: Locator;
  readonly suiteNameInput: Locator;
  readonly createButton: Locator;
  readonly manualTestButton: Locator;
  readonly testCaseTitleInput: Locator;
  readonly newStepButton: Locator;
  readonly saveTestCaseButton: Locator;

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

    this.testCaseTitleInput = page.getByLabel('Title');

    this.newStepButton = page.getByRole('button', {
      name: 'New step',
    });

    this.saveTestCaseButton = page.getByRole('button', {
      name: 'Save',
      exact: true,
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

  private async clickManualTestButton() {
    await this.manualTestButton.click();
  }

  private async checkToBeAutomated() {
    await this.page
      .getByText('To be automated', { exact: true })
      .click();
  }

  private async selectRequiredDropdowns() {
    await this.page.getByRole('combobox').nth(3).click();
    await this.page.getByRole('option', { name: 'Medium' }).click();

    await this.page.getByRole('combobox').nth(4).click();
    await this.page.getByRole('option', { name: 'Functional' }).click();

    await this.page.getByRole('combobox').nth(5).click();
    await this.page.getByRole('option', { name: 'Unit' }).click();

    await this.page.getByRole('combobox').nth(8).click();
    await this.page.getByRole('option', { name: 'Positive' }).click();
  }

  private async uploadAttachment() {
    await this.page
      .getByRole('article')
      .filter({
        has: this.page.getByRole('heading', {
          name: 'Test Case Steps',
          exact: true,
        }),
      })
      .locator('button:has(svg[data-icon="image"]):visible')
      .click();

    const dialog = this.page.getByRole('dialog');
    const fileChooserPromise = this.page.waitForEvent('filechooser');

    await dialog
      .getByText('Drop files here to upload', { exact: true })
      .click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/test-data/attachment.txt');

    await expect(dialog).not.toBeVisible();
  }

  private async addSteps() {
    const steps = [
      { action: 'Open project', expected: 'Project is opened' },
      { action: 'Click Manual test', expected: 'Create page is displayed' },
      { action: 'Enter title', expected: 'Title is entered' },
      { action: 'Select status', expected: 'Status is selected' },
      { action: 'Select priority', expected: 'Priority is selected' },
      { action: 'Fill steps', expected: 'Steps are added' },
      { action: 'Save test case', expected: 'Test case is created' },
    ];

    for (let i = 0; i < steps.length; i++) {
      await this.newStepButton.click();

      await this.page.locator('[data-placeholder="Step action"]').nth(i).click();
      await this.page.keyboard.type(steps[i].action);

      await this.page.locator('[data-placeholder="Expected result"]').nth(i).click();
      await this.page.keyboard.type(steps[i].expected);

      if (i === 0) {
        await this.uploadAttachment();
      }
    }
  }

  async createTestCase(title: string) {
    await this.clickManualTestButton();

    await this.testCaseTitleInput.fill(title);

    await this.selectRequiredDropdowns();
    await this.checkToBeAutomated();
    await this.addSteps();

    await this.saveTestCaseButton.click();
  }

  async expectTestCaseCreatedViaUI(title: string) {
    await expect(
      this.page.getByText(title).first()
    ).toBeVisible();
  }
}