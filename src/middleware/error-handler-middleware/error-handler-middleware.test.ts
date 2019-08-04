import express from 'express';
import request from 'supertest';
import createApp from '../../App';

describe('error handler', (): void => {
  let app: express.Application;
  beforeAll((): void => {
    app = createApp(express());
  });

  test('error handler must return a 500 when being called from the /health/error path', async () => {
    const res = await request(app).get('/health/error');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('App is unhealthy :(');
  });
});
