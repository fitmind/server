import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { OK } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import { createAdmin, deleteAdminByEmail, generateAdminValidLogin } from '../../../utils/testing-utils/testing-utils';

describe('admin Logout', () => {
  const URL = CONFIG.routes.admin.logout;
  let app: express.Application;
  const email = 'fitmind_admind@mail.com';
  const password = 'Testing123!';
  const validLogin = generateAdminValidLogin(email, password);

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await createAdmin(email, password);
  });
  afterAll(async () => {
    await deleteAdminByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid request', () => {
    it('should return OK and remove the cookie', async done => {
      const login = await request(app)
        .post(CONFIG.routes.admin.login)
        .send(validLogin);
      const loginCookie = login.header['set-cookie'][0];
      expect(loginCookie.includes(CONFIG.cookies.admin)).toBeTruthy();
      const res = await request(app)
        .post(URL)
        .set('Cookie', [loginCookie]);
      expect(res.status).toBe(OK);
      const cookie = res.header['set-cookie'][0].split(';')[0];
      // this means that the bearer token is not present in the string anymore, just the cookie header
      expect(cookie).toEqual(`${CONFIG.cookies.admin}=`);
      done();
    });
  });
});
