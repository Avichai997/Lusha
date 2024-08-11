import request from 'supertest';
import app from '../app';
import { HealthStatusStatusEnum } from '../types';

describe('Health Endpoint', () => {
  it('should return a healthy status and the correct version', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', HealthStatusStatusEnum.Ok);
    expect(res.body).toHaveProperty('version');
    expect(res.body.version).toMatch(/Server is healthy and running version:/);
  });
});
