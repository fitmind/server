import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import { NOT_FOUND, CREATED } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { getCookieFromHeader, userTestPassword } from '../../../utils/testing-utils/testing-utils';
import {
  deleteCustomerUserFromDbByEmail,
  loginCustomerUser,
  registerCustomerUser
} from '../../../utils/testing-utils/customer-user-utils';

describe('User Login', () => {
  const email = 'diego.login@testing.com';
  const password = userTestPassword;
  let app: express.Application;

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
    it('should return a 201 along with an authorization cookie', async done => {
      const res = await loginCustomerUser(app, email);
      const cookie = getCookieFromHeader(res);
      expect(res.status).toBe(CREATED);
      expect(cookie.includes(CONFIG.cookies.user)).toBeTruthy();
      done();
    });
  });

  describe('invalid request', () => {
    describe('email', () => {
      it('should return 404 if email is not found', async () => {
        const badLogin = { email: 'bad_email@test.com', password };
        const res = await loginCustomerUser(app, email, badLogin);
        expect(res.status).toBe(NOT_FOUND);
      });
    });
  });
});
