import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { omit } from 'ramda';
import { BAD_REQUEST, NOT_FOUND, CREATED, UNAUTHORIZED } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import {
  deleteFromDbByEmail,
  userTestPassword,
  userValidLogin,
  userValidSignUp
} from '../../../utils/testing-utils/testing-utils';

describe('User Login', () => {
  const URL = CONFIG.routes.user.login;
  const SIGN_UP_URL = CONFIG.routes.user.signUp;
  const email = 'diego.login@testing.com';
  const validSignUp = userValidSignUp(email);
  const validLogin = userValidLogin(email);
  const password = userTestPassword;
  let app: express.Application;

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
    it('should return a 201 along with an authorization cookie', async done => {
      const res = await request(app)
        .post(URL)
        .send(validLogin);
      const cookie = res.header['set-cookie'][0];
      expect(res.status).toBe(CREATED);
      expect(cookie.includes(CONFIG.cookies.user)).toBeTruthy();
      done();
    });
  });

  describe('invalid request', () => {
    describe('email', () => {
      it('should return 404 if email is not found', async () => {
        const res = await request(app)
          .post(URL)
          .send({ email: 'bad.email@test.com', password });
        expect(res.status).toBe(NOT_FOUND);
      });
      it('should return 400 if email is missing', async () => {
        const res = await request(app)
          .post(URL)
          .send(omit(['email'], validLogin));
        expect(res.status).toBe(BAD_REQUEST);
      });
      it('should return 400 if email is not an email', async () => {
        const res = await request(app)
          .post(URL)
          .send({ ...validLogin, email: 'broken_email.com' });
        expect(res.status).toBe(BAD_REQUEST);
      });
    });
    it('is missing sending the password', async () => {
      const res = await request(app)
        .post(URL)
        .send(omit(['password'], validLogin));
      expect(res.status).toBe(BAD_REQUEST);
    });
    it('should return bad request if the password doesnt match', async () => {
      const res = await request(app)
        .post(URL)
        .send({ email, password: 'wrongPassword' });
      expect(res.status).toBe(UNAUTHORIZED);
    });
  });
});
