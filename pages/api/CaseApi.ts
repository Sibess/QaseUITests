import { expect, type Response } from '@playwright/test';

export class CaseApi {
  async expectTestCaseCreatedViaApi(title: string, response: Response) {
    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.case.title).toBe(title);
    expect(body.case.status).toBe(0);
    expect(body.case.priority).toBe(2);
    expect(body.case.type).toBe(8);
    expect(body.case.behavior).toBe(2);
    expect(body.case.automation).toBe(1);
    expect(body.case.steps[0].attachments[0].file).toBe('attachment.txt');
  }
}