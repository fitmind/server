import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { UNAUTHORIZED, OK, NOT_FOUND } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import ExpertModel, { ExpertModelType } from '../expert.model';
import { filterExpertMe } from './expert-me';
import {
  deleteExpertByEmail,
  generateExpertUserValidSignUp,
  generateExpertValidLogin
} from '../../../utils/testing-utils/expert-user-utils';

describe('Expert get me', () => {
  let app: express.Application;
  let cookie: string;
  const URL = CONFIG.routes.expert.me;
  const SIGN_UP_URL = CONFIG.routes.expert.register;
  const LOGIN_URL = CONFIG.routes.expert.login;
  const email = 'expert_me@testing.com';
  const validSignUp = generateExpertUserValidSignUp(email);
  const validLogin = generateExpertValidLogin(email);
  let expert: ExpertModelType;
  let login;

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
    expert = (await ExpertModel.findOne({ email })) as ExpertModelType;
    login = await request(app)
      .post(LOGIN_URL)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
  });
  afterAll(async () => {
    await deleteExpertByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid request', () => {
    it('should return a 200 along with the filtered expert', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toEqual(OK);
      expect(JSON.stringify(res.body)).toEqual(JSON.stringify(filterExpertMe(expert as ExpertModelType)));
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
      await ExpertModel.findByIdAndDelete(expert._id);
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(NOT_FOUND);
    });
  });
});
