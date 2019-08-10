import express from 'express';
import createApp from '../../../App';
import UserModel from '../user.model';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { OK } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';

describe('User Logout', () => {
  const URL = CONFIG.routes.user.logout;
  const SIGN_UP_URL = CONFIG.routes.user.signUp;
  const LOGIN_URL = CONFIG.routes.user.login;
  const email = 'diego.logout@testing.com';
  let app: express.Application;
  const password = 'ValidPassword123!';
  const validSignUp = {
    name: 'Diego',
    email,
    description: 'some long string',
    password,
    interestedInExpertiseAreas: ['PERSONAL_COACH']
  };
  const validLogin = {
    email,
    password
  };
  let loginRes;

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
    loginRes = await request(app)
      .post(LOGIN_URL)
      .send(validLogin);
  });
  afterAll(async () => {
    await UserModel.findOneAndDelete({ email });
    await disconnectTestingDb();
  });
  describe('valid request', () => {
    it('should return a 200 along with an authorization cookie', async done => {
      loginRes = await request(app)
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
