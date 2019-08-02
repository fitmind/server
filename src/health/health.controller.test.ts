import express from 'express';
import createApp from '../App';
import request from 'supertest';

describe('Health controller', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp(express());
  });

  test('get', async done => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('App healthy :)');
    done();
  });
});
