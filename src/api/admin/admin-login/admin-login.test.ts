import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, OK } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { createAdmin, deleteAdminByEmail, generateAdminValidLogin } from '../../../utils/testing-utils/admin-utils';
import { getCookieFromHeader, postValidRequest } from '../../../utils/testing-utils/testing-utils';

describe('Admin Login', () => {
  const URL = CONFIG.routes.admin.login;
  const email = 'admin.login@testing.com';
  const validLogin = generateAdminValidLogin(email);
  let app: express.Application;
  let adminUser;

  beforeAll(async done => {
    app = createApp(express());
    await setTestingDbConnection();
    adminUser = await createAdmin(email);
    done();
  });
  afterAll(async done => {
    await deleteAdminByEmail(email);
    await disconnectTestingDb();
    done();
  });
  describe('valid request', () => {
    it('should return a 201 along with an authorization cookie', async done => {
      const res = await postValidRequest(app, URL, validLogin);
      const cookie = getCookieFromHeader(res);
      expect(res.status).toBe(OK);
      expect(cookie.includes(CONFIG.cookies.admin)).toBeTruthy();
      done();
    });
  });
  describe('invalid request', () => {
    it('should return BAD_REQUEST if data is invalid', async done => {
      const res = await postValidRequest(app, URL, { bad: 'field' });
      expect(res.status).toEqual(BAD_REQUEST);
      done();
    });
    it('should return unauthorised if passwords dont match', async done => {
      const res = await postValidRequest(app, URL, { email, password: 'not-right' });
      expect(res.status).toEqual(UNAUTHORIZED);
      done();
    });
    it('should return NOT_FOUND if the user doesnt exist', async done => {
      await deleteAdminByEmail(email);
      const res = await postValidRequest(app, URL, validLogin);
      expect(res.status).toEqual(NOT_FOUND);
      done();
    });
  });
});
