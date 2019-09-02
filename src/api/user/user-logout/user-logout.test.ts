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
  deleteCustomerUserFromDbByEmail,
  loginCustomerUser,
  registerCustomerUser
} from '../../../utils/testing-utils/customer-user-utils';
import { getCookieFromHeader } from '../../../utils/testing-utils/testing-utils';

describe('User Logout', () => {
  const URL = CONFIG.routes.user.logout;
  let app: express.Application;
  const email = 'login@email.com';

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await registerCustomerUser(app, email);
  });
  afterAll(async () => {
    await deleteCustomerUserFromDbByEmail(email);
    await disconnectTestingDb();
  });
  describe('valid request', () => {
    it('should return a 200 along with an authorization cookie', async done => {
      const loginRes = await loginCustomerUser(app, email);

      const loginCookie = getCookieFromHeader(loginRes);
      expect(loginCookie.includes(CONFIG.cookies.user)).toBeTruthy();

      const res = await request(app)
        .post(URL)
        .set('Cookie', [loginCookie]);
      expect(res.status).toBe(OK);
      const cookie = getCookieFromHeader(res).split(';')[0];
      // this means that the bearer token is not present in the string anymore, just the cookie header
      expect(cookie).toEqual(`${CONFIG.cookies.user}=`);
      done();
    });
  });
});
