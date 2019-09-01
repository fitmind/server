import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { OK } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import {
  deleteExpertByEmail,
  generateExpertUserValidSignUp,
  generateExpertValidLogin
} from '../../../utils/testing-utils/expert-user-utils';

describe('expert Logout', () => {
  const URL = CONFIG.routes.expert.logout;
  const SIGN_UP_URL = CONFIG.routes.expert.register;
  const LOGIN_URL = CONFIG.routes.expert.login;
  let app: express.Application;
  const email = 'expertlogout@email.com';
  const validSignUp = generateExpertUserValidSignUp(email);
  const validLogin = generateExpertValidLogin(email);

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
  });
  afterAll(async () => {
    await deleteExpertByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid request', () => {
    it('should return OK and remove the cookie', async done => {
      const loginRes = await request(app)
        .post(LOGIN_URL)
        .send(validLogin);

      const loginCookie = loginRes.header['set-cookie'][0];
      expect(loginCookie.includes(CONFIG.cookies.expert)).toBeTruthy();

      const res = await request(app)
        .post(URL)
        .set('Cookie', [loginCookie]);
      expect(res.status).toBe(OK);
      const cookie = res.header['set-cookie'][0].split(';')[0];
      // this means that the bearer token is not present in the string anymore, just the cookie header
      expect(cookie).toEqual(`${CONFIG.cookies.expert}=`);
      done();
    });
  });
});
