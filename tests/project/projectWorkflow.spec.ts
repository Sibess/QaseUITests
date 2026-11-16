import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/authentication/LoginPage';
import { ProjectsListPage } from '../../pages/projects/ProjectsListPage';
import { ProjectDetailsPage } from '../../pages/project/ProjectDetailsPage';
import { CaseCreatePage } from '../../pages/case/CaseCreatePage';
import { SuiteApi } from '../../api/SuiteApi';
import { ProjectApi } from '../../api/ProjectApi';
import { CaseApi } from '../../api/CaseApi';

test.describe('Project Workflow Tests', () => {
  test.describe.configure({ mode: 'serial' });

  let loginPage: LoginPage;
  let projectsListPage: ProjectsListPage;
  let projectDetailsPage: ProjectDetailsPage;
  let caseCreatePage: CaseCreatePage;
  let suiteApi: SuiteApi;
  let projectApi: ProjectApi;
  let caseApi: CaseApi;

  test.beforeEach(async ({ page, request }) => {
    projectApi = new ProjectApi();

    await projectApi.deleteAllProjects(request);

    loginPage = new LoginPage(page);
    projectsListPage = new ProjectsListPage(page);
    projectDetailsPage = new ProjectDetailsPage(page);
    caseCreatePage = new CaseCreatePage(page);
    suiteApi = new SuiteApi();
    caseApi = new CaseApi();

    await loginPage.openLoginPage();
    await loginPage.login();
  });

  test('should create a new project', async ({ page, request }) => {

    const projectName = `Auto Test Project ${Date.now()}`;
    const projectCode = `TEST${Date.now().toString().slice(-6)}`;

    await projectsListPage.clickCreateNewProject();
    await projectsListPage.fillProjectName(projectName);
    await projectsListPage.fillProjectCode(projectCode);
    await projectsListPage.createNewProject();
    await projectsListPage.isProjectCreated(projectCode);
    await projectApi.deleteProject(request, projectCode);
  });

  test('should create a new suite', async ({ page, request }) => {

    const projectName = `Auto Test Project ${Date.now()}`;
    const projectCode = `TEST${Date.now().toString().slice(-6)}`;
    const suiteName = `Auto Test Suite ${Date.now()}`;

    await projectApi.createProject(request, projectName, projectCode);

    await projectsListPage.openProject(projectName);

    await projectDetailsPage.createSuite(suiteName);
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
    await projectsListPage.openProject(projectName);

    const caseLoadResponsePromise = page.waitForResponse((response) =>
      new URL(response.url()).pathname === '/v2/case/load'
    );

    await projectDetailsPage.clickManualTestButton();
    await caseCreatePage.createTestCase(testCaseTitle);

    const response = await caseLoadResponsePromise;
    await caseApi.expectTestCaseCreatedViaApi(testCaseTitle, response);

    await projectDetailsPage.expectTestCaseCreatedViaUI(testCaseTitle);

    await projectApi.deleteProject(request, projectCode);
  });
});