import { Page, Locator, expect } from '@playwright/test';

export class ProjectsPage {
  readonly page: Page;
  readonly projectsHeading: Locator;
  readonly projectNameInput: Locator;
  readonly projectCodeInput: Locator;
  readonly createNewProjectButton: Locator;
  readonly createProjectButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.projectsHeading = page.getByRole('heading', { name: 'Projects' });

    this.createNewProjectButton = page.getByText('Create new project', {
      exact: true,
    });

    this.projectNameInput = page.getByRole('textbox', { name: 'Project name*' });
    this.projectCodeInput = page.getByRole('textbox', { name: 'Project code*' });

    this.createProjectButton = page.getByRole('button', {
      name: 'Create project',
    });
  }

  async isUserLoggedIn() {
    await this.page.waitForResponse(
      response =>
        response.url().includes('/v1/projects/list') && response.status() === 200,
    );
    await expect(this.page).toHaveURL(/.*projects/);
    await expect(this.projectsHeading).toBeVisible();
    await expect(this.createNewProjectButton).toBeVisible();
  }

  async clickCreateNewProject() {
    await this.createNewProjectButton.click();
  }

  async fillProjectName(projectName: string) {
    await this.projectNameInput.fill(projectName);
  }

  async fillProjectCode(projectCode: string) {
    await this.projectCodeInput.fill(projectCode);
  }

  async createNewProject() {
    await this.createProjectButton.click();
  }

  async isProjectCreated(projectCode: string) {
    const code = projectCode.toUpperCase();

    await expect(this.page).toHaveURL(new RegExp(`/project/${code}$`));
    await expect(this.page.getByText(`${code} repository`)).toBeVisible();
  }

  async openProject(projectName: string) {
    await this.page.getByText(projectName, { exact: true }).click();
  }
}