import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/authentication/Login';
import { ProjectsPage } from '../../pages/projects/Projects';
import { ProjectPage } from '../../pages/project/Project';
import { SuiteApi } from '../../pages/api/SuiteApi';
import { ProjectApi } from '../../pages/api/ProjectApi';
import { CaseApi } from '../../pages/api/CaseApi';

test.describe('Projects Page Tests', () => {
  test.describe.configure({ mode: 'serial' });

  let loginPage: LoginPage;
  let projectsPage: ProjectsPage;
  let projectPage: ProjectPage;
  let suiteApi: SuiteApi;
  let projectApi: ProjectApi;
  let caseApi: CaseApi;

  test.beforeEach(async ({ page, request }) => {
    await page.reload();
    projectApi = new ProjectApi();

    await projectApi.deleteAllProjects(request);

    loginPage = new LoginPage(page);
    projectsPage = new ProjectsPage(page);
    projectPage = new ProjectPage(page);
    suiteApi = new SuiteApi();
    caseApi = new CaseApi();

    await loginPage.openLoginPage();
    await loginPage.login();
  });

  test('should create a new project', async ({ page, request }) => {
test.setTimeout(60_000);

    const projectName = `Auto Test Project ${Date.now()}`;
    const projectCode = `TEST${Date.now().toString().slice(-6)}`;

    await projectsPage.clickCreateNewProject();
    await projectsPage.fillProjectName(projectName);
    await projectsPage.fillProjectCode(projectCode);
    await projectsPage.createNewProject();
    await projectsPage.isProjectCreated(projectCode);
    await projectApi.deleteProject(request, projectCode);
  });

  test('should create a new suite', async ({ page, request }) => {

    const projectName = `Auto Test Project ${Date.now()}`;
    const projectCode = `TEST${Date.now().toString().slice(-6)}`;
    const suiteName = `Auto Test Suite ${Date.now()}`;

    await projectApi.createProject(request, projectName, projectCode);

    await projectsPage.openProject(projectName);

    await projectPage.createSuite(suiteName);
    await suiteApi.verifySuiteCreated(request, projectCode, suiteName);

    await projectApi.deleteProject(request, projectCode);
  });

  test('should create a new test case', async ({ page, request }) => {

    const projectName = `Auto Test Project ${Date.now()}`;
    const projectCode = `TEST${Date.now().toString().slice(-6)}`;
    const suiteName = `Auto Test Suite ${Date.now()}`;
    const testCaseTitle = `Auto Test Case ${Date.now()}`;

    await projectApi.createProject(request, projectName, projectCode);
    await suiteApi.createSuite(request, projectCode, suiteName);
    await projectsPage.openProject(projectName);
    const caseLoadResponsePromise = page.waitForResponse((response) =>
      new URL(response.url()).pathname === '/v2/case/load'
    );
    await projectPage.createTestCase(testCaseTitle);
    const response = await caseLoadResponsePromise;
    await caseApi.expectTestCaseCreatedViaApi(testCaseTitle, response);

    await projectPage.expectTestCaseCreatedViaUI(testCaseTitle);

    await projectApi.deleteProject(request, projectCode);
  });
});