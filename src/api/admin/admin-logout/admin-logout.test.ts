import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import { OK } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { createAdmin, deleteAdminByEmail, loginAdminUser } from '../../../utils/testing-utils/admin-utils';
import { getCookieFromHeader, postValidRequestWithoutData } from '../../../utils/testing-utils/testing-utils';

describe('admin Logout', () => {
  const URL = CONFIG.routes.admin.logout;
  let app: express.Application;
  const email = 'fitmind_admind@mail.com';

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await createAdmin(email);
  });
  afterAll(async () => {
    await deleteAdminByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid request', () => {
    it('should return OK and remove the cookie', async done => {
      const login = await loginAdminUser(app, email);
      const loginCookie = getCookieFromHeader(login);
      expect(loginCookie.includes(CONFIG.cookies.admin)).toBeTruthy();
      const res = await postValidRequestWithoutData(app, URL, loginCookie);
      expect(res.status).toBe(OK);
      const cookie = getCookieFromHeader(res).split(';')[0];
      // this means that the bearer token is not present in the string anymore, just the cookie header
      expect(cookie).toEqual(`${CONFIG.cookies.admin}=`);
      done();
    });
  });
});
