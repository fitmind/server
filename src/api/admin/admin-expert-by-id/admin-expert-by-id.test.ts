import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, OK, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { createAdmin, deleteAdminByEmail, loginAdminUser } from '../../../utils/testing-utils/admin-utils';
import { deleteExpertByEmail, generateExpertForTesting } from '../../../utils/testing-utils/expert-user-utils';
import { getValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Admin expert by id', () => {
  let URL = '';
  let app = createApp(express());
  const email = 'adminexpertretrieve123@gmail.com';
  const expertEmail = 'retrieveexpert@mail.com';
  let cookie: string, login, expert, id: string;

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email);
    expert = await generateExpertForTesting(expertEmail);
    URL = CONFIG.routes.admin.expertId(expert._id);
    login = await loginAdminUser(app, email);
    cookie = login.header['set-cookie'][0];
    done();
  });
  afterAll(async done => {
    await deleteAdminByEmail(email);
    await deleteExpertByEmail(expertEmail);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should allow the admin retrieve the experts in pending status', async done => {
      const res = await getValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toBe(OK);
      expect(res.body.id).toEqual(id);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return BAD REQUEST if the param is wrong', async done => {
      const badUrl = CONFIG.routes.admin.expertId('badUrl');
      const res = await getValidRequestWithCookie(app, badUrl, cookie);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return NOT_FOUND if the user doesnt exist', async done => {
      const badUrl = CONFIG.routes.admin.expertId('5d5e62f187f5450ade0c1xxx');
      const res = await getValidRequestWithCookie(app, badUrl, cookie);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });

    it('should return 401 if the authentication failed', async done => {
      const res = await getValidRequestWithCookie(app, URL, 'wrong-token');
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 404 if it was not possible to find the admin', async done => {
      await deleteAdminByEmail(email);
      const res = await getValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
