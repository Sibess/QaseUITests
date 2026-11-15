import { APIRequestContext, expect } from '@playwright/test';
import { API_URL, getHeaders } from './ApiHelper';

export class SuiteApi {
  async createSuite(
    request: APIRequestContext,
    projectCode: string,
    suiteName: string,
  ) {
    const response = await request.post(`${API_URL}/suite/${projectCode}`, {
      headers: getHeaders(),
      data: {
        title: suiteName,
      },
    });

    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async verifySuiteCreated(
    request: APIRequestContext,
    projectCode: string,
    suiteName: string,
  ) {
    await expect
      .poll(async () => {
        const response = await request.get(`${API_URL}/suite/${projectCode}`, {
          headers: getHeaders(),
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        return body.result.entities.find(
          (item: any) => item.title === suiteName,
        );
      })
      .toBeTruthy();
  }
}