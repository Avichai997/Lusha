import request from 'supertest';
import app from '../app';
import { StatusCodes } from 'http-status-codes';

describe('Not Found Route', () => {
  it('should return a 404 error for an unknown route', async () => {
    const res = await request(app).get('/unknown-route');

    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty(
      'message',
      `The URL /unknown-route does not exist on the server!`
    );
  });
});
