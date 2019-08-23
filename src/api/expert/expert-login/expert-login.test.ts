import createApp from '../../../App';
import express from 'express';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import CONFIG from '../../../config/config';
import { OK, UNAUTHORIZED, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import {
  deleteExpertByEmail,
  generateExpertLogin,
  generateExpertValidSignUp
} from '../../../utils/testing-utils/testing-utils';
import ExpertModel from '../expert.model';

describe('expert login', () => {
  let app = createApp(express());
  const URL = CONFIG.routes.expert.login;
  const SIGN_URL = CONFIG.routes.expert.register;
  const email = 'expertregister@mail.com';
  const validSignUp = generateExpertValidSignUp(email);
  const validLogin = generateExpertLogin(email);

  beforeAll(async done => {
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_URL)
      .send(validSignUp);
    done();
  });

  afterAll(async done => {
    await disconnectTestingDb();
    await deleteExpertByEmail(email);
    done();
  });

  describe('valid login', () => {
    it('returns OK on valid login', async done => {
      const res = await request(app)
        .post(URL)
        .send(validLogin);
      expect(res.status).toEqual(OK);
      done();
    });
  });

  describe('invalid login', () => {
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
