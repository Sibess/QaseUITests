import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/public/Home';

test.describe('Home Page Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.gotoBaseURL();
  });

  test('should display navigation menu links', async ({ page }) => {
    await homePage.expectHeaderLinksVisible();
  });

  test('should accept cookies dialog', async ({ page }) => {
    await homePage.expectCookiesDialogVisible();
    await homePage.acceptCookies();
    await homePage.expectCookiesDialogHidden();
  });
});