import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, OK, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import {
  createAdmin,
  deleteAdminByEmail,
  deleteExpertByEmail,
  generateAdminValidLogin,
  generateExpertForTesting
} from '../../../utils/testing-utils/testing-utils';

describe('Admin pending expert', () => {
  let URL = '';
  let app = createApp(express());
  const email = 'adminexpertretrieve123@gmail.com';
  const expertEmail = 'retrieveexpert@mail.com';
  const password = 'Testing123!';
  let cookie: string, login, expert, id: string;
  const validLogin = generateAdminValidLogin(email, password);

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email, password);
    expert = await generateExpertForTesting(expertEmail);
    URL = CONFIG.routes.admin.expertId(expert._id);
    login = await request(app)
      .post(CONFIG.routes.admin.login)
      .send(validLogin);
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
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(OK);
      expect(res.body.id).toEqual(id);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return BAD REQUEST if the param is wrong', async done => {
      const badUrl = CONFIG.routes.admin.expertId('badUrl');
      const res = await request(app)
        .get(badUrl)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return NOT_FOUND if the user doesnt exist', async done => {
      const badUrl = CONFIG.routes.admin.expertId('5d5e62f187f5450ade0c1xxx');
      console.log(badUrl);
      const res = await request(app)
        .get(badUrl)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });

    it('should return 401 if the authentication failed', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [`${CONFIG.cookies.admin}=wrong_token`]);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 404 if it was not possible to find the admin', async done => {
      await deleteAdminByEmail(email);
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
