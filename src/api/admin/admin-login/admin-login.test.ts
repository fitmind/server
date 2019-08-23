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
  generateAdminValidLogin,
  userTestPassword,
  userValidLogin,
  userValidSignUp
} from '../../../utils/testing-utils/testing-utils';

describe('Admin Login', () => {
  const URL = CONFIG.routes.admin.login;
  const email = 'admin.login@testing.com';
  const validLogin = generateAdminValidLogin(email);
  const password = userTestPassword;
  let app: express.Application;

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    // todo: need to create an admin user
  });
  afterAll(async () => {
    // await deleteFromDbByEmail(email);
    await disconnectTestingDb();
  });
  describe('valid request', () => {
    it('should return a 201 along with an authorization cookie', async done => {
      // const res = await request(app)
      //     .post(URL)
      //     .send(validLogin);
      // const cookie = res.header['set-cookie'][0];
      // expect(res.status).toBe(CREATED);
      // expect(cookie.includes(CONFIG.cookies.user)).toBeTruthy();
      // done();
    });
  });
});
