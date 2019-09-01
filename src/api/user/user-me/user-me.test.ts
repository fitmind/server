import express from 'express';
import createApp from '../../../App';
import UserModel, { UserModelType } from '../user.model';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { UNAUTHORIZED, OK, NOT_FOUND } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { filterUserMe } from './user-me';
import {} from '../../../utils/testing-utils/testing-utils';
import {
  deleteCustomerUserFromDbByEmail,
  generateCustomerUserValidLogin,
  generateCustomerUserValidSignUp
} from '../../../utils/testing-utils/customer-user-utils';

describe('User get me', () => {
  const URL = CONFIG.routes.user.me;
  const SIGN_UP_URL = CONFIG.routes.user.signUp;
  const LOGIN_URL = CONFIG.routes.user.login;
  const email = 'user_me@testing.com';
  const validSignUp = generateCustomerUserValidSignUp(email);
  const validLogin = generateCustomerUserValidLogin(email);
  let app: express.Application;
  let cookie: string;
  let user: UserModelType | null;
  let login = null;

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
    user = (await UserModel.findOne({ email })) as UserModelType;
    login = await request(app)
      .post(LOGIN_URL)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
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
      const res = await request(app)
        .get(URL)
        .set('Cookie', [`${CONFIG.cookies.user}=wrong_token`]);
      expect(res.status).toBe(UNAUTHORIZED);
    });
    it('should return 404 if it was not possible to find the user', async () => {
      // @ts-ignore
      await UserModel.findByIdAndDelete(user._id);
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(NOT_FOUND);
    });
  });
});
