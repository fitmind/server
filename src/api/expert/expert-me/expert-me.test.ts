import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import { UNAUTHORIZED, OK, NOT_FOUND } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { ExpertModelType } from '../expert.model';
import { filterExpertMe } from './expert-me';
import {
  deleteExpertByEmail,
  getExpertUserByMail,
  loginExpertUser,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';
import {
  deleteExpertById,
  getCookieFromHeader,
  getValidRequestWithCookie
} from '../../../utils/testing-utils/testing-utils';

describe('Expert get me', () => {
  let app: express.Application;
  let cookie: string;
  const URL = CONFIG.routes.expert.me;
  const email = 'expert_me@testing.com';
  let expert: ExpertModelType;
  let login;

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await registerExpertUser(app, email);
    expert = await getExpertUserByMail(email);
    login = await loginExpertUser(app, email);
    cookie = getCookieFromHeader(login);
  });
  afterAll(async () => {
    await deleteExpertByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid request', () => {
    it('should return a 200 along with the filtered expert', async done => {
      const res = await getValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toEqual(OK);
      expect(JSON.stringify(res.body)).toEqual(JSON.stringify(filterExpertMe(expert as ExpertModelType)));
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async () => {
      const badCookie = `${CONFIG.cookies.user}=wrong_token`;
      const res = await getValidRequestWithCookie(app, URL, badCookie);
      expect(res.status).toBe(UNAUTHORIZED);
    });
    it('should return 404 if it was not possible to find the user', async () => {
      await deleteExpertById(expert.id);
      const res = await getValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toBe(NOT_FOUND);
    });
  });
});
