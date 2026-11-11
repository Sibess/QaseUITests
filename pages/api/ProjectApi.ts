import { APIRequestContext, expect } from '@playwright/test';

export class ProjectApi {
  async createProject(
    request: APIRequestContext,
    projectName: string,
    projectCode: string
  ) {
    const response = await request.post(
      `${process.env.QASE_API_URL!}/project`,
      {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Token: process.env.QASE_API_TOKEN!,
        },
        data: {
          title: projectName,
          code: projectCode,
        },
      }
    );

    expect(response.status()).toBe(200);
  }

  async deleteProject(request: APIRequestContext, projectCode: string) {
    const response = await request.delete(
      `${process.env.QASE_API_URL!}/project/${projectCode}`,
      {
        headers: {
          Token: process.env.QASE_API_TOKEN!,
        },
      }
    );

    expect(response.status()).toBe(200);
  }

  async getAllProjects(request: APIRequestContext) {
    const response = await request.get(
      `${process.env.QASE_API_URL!}/project`,
      {
        headers: {
          Token: process.env.QASE_API_TOKEN!,
        },
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    return body.result.entities;
  }

  async deleteAllProjects(request: APIRequestContext) {
    const projects = await this.getAllProjects(request);

    for (const project of projects) {
      await this.deleteProject(request, project.code);
    }
  }
}