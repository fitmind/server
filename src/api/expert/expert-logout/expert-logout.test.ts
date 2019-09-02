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
  loginExpertUser,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';
import { getCookieFromHeader } from '../../../utils/testing-utils/testing-utils';

describe('expert Logout', () => {
  const URL = CONFIG.routes.expert.logout;
  let app: express.Application;
  const email = 'expertlogout@email.com';

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await registerExpertUser(app, email);
  });
  afterAll(async () => {
    await deleteExpertByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid request', () => {
    it('should return OK and remove the cookie', async done => {
      const loginRes = await loginExpertUser(app, email);

      const loginCookie = getCookieFromHeader(loginRes);
      expect(loginCookie.includes(CONFIG.cookies.expert)).toBeTruthy();

      const res = await request(app)
        .post(URL)
        .set('Cookie', [loginCookie]);
      expect(res.status).toBe(OK);
      const cookie = getCookieFromHeader(res).split(';')[0];
      // this means that the bearer token is not present in the string anymore, just the cookie header
      expect(cookie).toEqual(`${CONFIG.cookies.expert}=`);
      done();
    });
  });
});
