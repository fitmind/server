import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, OK } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import {
  createAdminByEmail,
  deleteAdminByEmail,
  generateAdminValidLogin,
  userTestPassword
} from '../../../utils/testing-utils/testing-utils';
import ExpertModel from '../../expert/expert.model';

describe('Admin Login', () => {
  const URL = CONFIG.routes.admin.login;
  const email = 'admin.login@testing.com';
  const password = userTestPassword;
  const validLogin = generateAdminValidLogin(email, password);
  let app: express.Application;
  let adminUser;

  beforeAll(async done => {
    app = createApp(express());
    await setTestingDbConnection();
    adminUser = await createAdminByEmail(email, password);
    console.log(adminUser);
    done();
  });
  afterAll(async () => {
    await deleteAdminByEmail(email);
    await disconnectTestingDb();
  });
  describe('valid request', () => {
    it('should return a 201 along with an authorization cookie', async done => {
      const res = await request(app)
        .post(URL)
        .send(validLogin);
      console.log(res.header);
      console.log(res.status);
      const cookie = res.header['set-cookie'][0];
      expect(res.status).toBe(OK);
      expect(cookie.includes(CONFIG.cookies.admin)).toBeTruthy();
      done();
    });
  });
  describe('invalid request', () => {
    it('should return BAD_REQUEST if data is invalid', async done => {
      const res = await request(app)
        .post(URL)
        .send({ badField: '' });
      expect(res.status).toEqual(BAD_REQUEST);
      done();
    });
    it('should return unauthorised if passwords dont match', async done => {
      const res = await request(app)
        .post(URL)
        .send({ email, password: 'not-right' });
      expect(res.status).toEqual(UNAUTHORIZED);
      done();
    });
    it('should return NOT_FOUND if the user doesnt exist', async done => {
      await ExpertModel.remove({ email });
      const res = await request(app)
        .post(URL)
        .send({ email: 'notfound@mail.com', password: 'Testing123!' });
      expect(res.status).toEqual(NOT_FOUND);
      done();
    });
  });
});
