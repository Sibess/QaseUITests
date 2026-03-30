import { test, expect } from '@playwright/test';
import { LandingPage } from '../../pages/public/landing';

test.describe('Landing Page Tests', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.gotoBaseURL();
  });

  test('should display navigation menu links', async ({ page }) => {
    await landingPage.expectHeaderLinksVisible();
  });

  test('should accept cookies dialog', async ({ page }) => {
    await landingPage.expectCookiesDialogVisible();
    await landingPage.acceptCookies();
    await landingPage.expectCookiesDialogHidden();
  });
});