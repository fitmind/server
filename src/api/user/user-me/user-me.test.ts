import express from 'express';
import createApp from '../../../App';
import { UserModelType } from '../user.model';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { UNAUTHORIZED, OK, NOT_FOUND } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { filterUserMe } from './user-me';
import {
  deleteCustomerUserById,
  deleteCustomerUserFromDbByEmail,
  getCustomerUserByEmail,
  loginCustomerUser,
  registerCustomerUser
} from '../../../utils/testing-utils/customer-user-utils';
import {
  getCookieFromHeader,
  requestWithWrongCookie,
  getValidRequestWithCookie
} from '../../../utils/testing-utils/testing-utils';

describe('User get me', () => {
  const URL = CONFIG.routes.user.me;
  const email = 'user_me@testing.com';
  let app: express.Application;
  let cookie: string;
  let user: UserModelType;
  let login = null;

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await registerCustomerUser(app, email);
    user = await getCustomerUserByEmail(email);
    login = await loginCustomerUser(app, email);
    cookie = getCookieFromHeader(login);
  });
  afterAll(async () => {
    await deleteCustomerUserFromDbByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid request', () => {
    it('should return a 200 along with an authorization cookie', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toEqual(OK);
      expect(JSON.stringify(res.body)).toEqual(JSON.stringify(filterUserMe(user as UserModelType)));
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async () => {
      const res = await requestWithWrongCookie(app, URL);
      expect(res.status).toBe(UNAUTHORIZED);
    });
    it('should return 404 if it was not possible to find the user', async () => {
      await deleteCustomerUserById(user.id);
      const res = await getValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toBe(NOT_FOUND);
    });
  });
});
