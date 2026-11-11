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

  private async addSteps() {
    await this.newStepButton.click();

    await this.page.locator('[data-placeholder="Step action"]').click();
    await this.page.keyboard.type('Open project');

    await this.page.locator('[data-placeholder="Expected result"]').click();
    await this.page.keyboard.type('Project is opened');

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
    await fileChooser.setFiles('tests/fixtures/attachment.txt');

    await expect(dialog).not.toBeVisible();

    await this.newStepButton.click();

    await this.page.locator('[data-placeholder="Step action"]').nth(1).click();
    await this.page.keyboard.type('Click Manual test');

    await this.page.locator('[data-placeholder="Expected result"]').nth(1).click();
    await this.page.keyboard.type('Create page is displayed');

    await this.newStepButton.click();

    await this.page.locator('[data-placeholder="Step action"]').nth(2).click();
    await this.page.keyboard.type('Enter title');

    await this.page.locator('[data-placeholder="Expected result"]').nth(2).click();
    await this.page.keyboard.type('Title is entered');

    await this.newStepButton.click();

    await this.page.locator('[data-placeholder="Step action"]').nth(3).click();
    await this.page.keyboard.type('Select status');

    await this.page.locator('[data-placeholder="Expected result"]').nth(3).click();
    await this.page.keyboard.type('Status is selected');

    await this.newStepButton.click();

    await this.page.locator('[data-placeholder="Step action"]').nth(4).click();
    await this.page.keyboard.type('Select priority');

    await this.page.locator('[data-placeholder="Expected result"]').nth(4).click();
    await this.page.keyboard.type('Priority is selected');

    await this.newStepButton.click();

    await this.page.locator('[data-placeholder="Step action"]').nth(5).click();
    await this.page.keyboard.type('Fill steps');

    await this.page.locator('[data-placeholder="Expected result"]').nth(5).click();
    await this.page.keyboard.type('Steps are added');

    await this.newStepButton.click();

    await this.page.locator('[data-placeholder="Step action"]').nth(6).click();
    await this.page.keyboard.type('Save test case');

    await this.page.locator('[data-placeholder="Expected result"]').nth(6).click();
    await this.page.keyboard.type('Test case is created');
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