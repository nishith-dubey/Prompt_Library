import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server';

let app: any;

beforeAll(async () => {
  app = await createApp();
});

describe('Health API', () => {

  it('should return HTTP 200', async () => {

    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
  });

  it('should return correct service status', async () => {

    const response = await request(app)
      .get('/api/health');

    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('Prompt Library API');

    const invalidRouteResponse = await request(app)
      .get('/api/does-not-exist');

    expect(invalidRouteResponse.status).toBe(404);
  });

});