import { APIRequestContext, expect } from '@playwright/test';

export class SuiteApi {
  async createSuite(
    request: APIRequestContext,
    projectCode: string,
    suiteName: string,
  ) {
    const response = await request.post(
      `${process.env.QASE_API_URL!}/suite/${projectCode}`,
      {
        headers: {
          Token: process.env.QASE_API_TOKEN!,
          'Content-Type': 'application/json',
        },
        data: {
          title: suiteName,
        },
      },
    );

    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async verifySuiteCreated(
    request: APIRequestContext,
    projectCode: string,
    suiteName: string,
  ) {
    const response = await request.get(
      `${process.env.QASE_API_URL!}/suite/${projectCode}`,
      {
        headers: {
          Token: process.env.QASE_API_TOKEN!,
          accept: 'application/json',
        },
      },
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    const suite = body.result.entities.find(
      (item: any) => item.title === suiteName,
    );

    expect(suite).toBeTruthy();
  }
}