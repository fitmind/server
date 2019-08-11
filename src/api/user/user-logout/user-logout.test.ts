import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { OK } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import {
  deleteFromDbByEmail,
  userValidLogin,
  userValidSignUp
} from '../../../utils/user-testing-utils/user-testing-utils';

describe('User Logout', () => {
  const URL = CONFIG.routes.user.logout;
  const SIGN_UP_URL = CONFIG.routes.user.signUp;
  const LOGIN_URL = CONFIG.routes.user.login;
  let app: express.Application;
  const email = 'login@email.com';
  const validSignUp = userValidSignUp(email);
  const validLogin = userValidLogin(email);

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
  });
  afterAll(async () => {
    await deleteFromDbByEmail(email);
    await disconnectTestingDb();
  });
  describe('valid request', () => {
    it('should return a 200 along with an authorization cookie', async done => {
      const loginRes = await request(app)
        .post(LOGIN_URL)
        .send(validLogin);

      const loginCookie = loginRes.header['set-cookie'][0];
      expect(loginCookie.includes(CONFIG.cookies.user)).toBeTruthy();

      const res = await request(app)
        .post(URL)
        .set('Cookie', [loginCookie]);
      expect(res.status).toBe(OK);
      const cookie = res.header['set-cookie'][0].split(';')[0];
      // this means that the bearer token is not present in the string anymore, just the cookie header
      expect(cookie).toEqual('X-Fitmind-Authorization=');
      done();
    });
  });
});
