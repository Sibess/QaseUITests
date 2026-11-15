import { APIRequestContext, expect } from '@playwright/test';
import { API_URL, getHeaders } from './ApiHelper';

export class ProjectApi {
  async createProject(
    request: APIRequestContext,
    projectName: string,
    projectCode: string
  ) {
    const response = await request.post(`${API_URL}/project`, {
      headers: getHeaders(),
      data: {
        title: projectName,
        code: projectCode,
      },
    });

    expect(response.status()).toBe(200);
  }

  async deleteProject(request: APIRequestContext, projectCode: string) {
    const response = await request.delete(`${API_URL}/project/${projectCode}`, {
      headers: getHeaders(),
    });

    expect(response.status()).toBe(200);
  }

  async getAllProjects(request: APIRequestContext) {
    const response = await request.get(`${API_URL}/project`, {
      headers: getHeaders(),
    });

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