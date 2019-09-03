import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import CONFIG from '../../../config/config';
import { UNAUTHORIZED, BAD_REQUEST, OK, NOT_FOUND } from 'http-status-codes';
import {
  deleteExpertByEmail,
  getExpertUserByMail,
  loginExpertUser,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';
import {
  getCookieFromHeader,
  putValidRequestWithCookie,
  testingPictureUrl
} from '../../../utils/testing-utils/testing-utils';

describe('expert update', () => {
  const URL = CONFIG.routes.expert.me;
  let app: express.Application;
  const email = 'updateexpert@gmail.com';
  let login, cookie: string;
  const updateFirstName = 'Jose';
  const validUpdate = {
    name: 'Diego',
    description: 'some long string',
    pictureUrl: testingPictureUrl,
    isAnExpertIn: ['PERSONAL_COACH'],
    weeklyAvailability: {
      monday: ['06:00'],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  };
  const updatedData = { ...validUpdate, name: updateFirstName };

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await registerExpertUser(app, email);
    login = await loginExpertUser(app, email);
    cookie = getCookieFromHeader(login);
  });

  afterAll(async () => {
    await deleteExpertByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid', () => {
    it('should return OK if the expert has been updated', async done => {
      const res = await putValidRequestWithCookie(app, URL, cookie, updatedData);
      expect(res.status).toEqual(OK);
      const expert = await getExpertUserByMail(email);
      expect(expert.name).toEqual(updateFirstName);
      done();
    });
  });

  describe('invalid', () => {
    it('should BAD_REQUEST if the data is invalid', async done => {
      const res = await putValidRequestWithCookie(app, URL, cookie, { badField: 123 });
      expect(res.status).toEqual(BAD_REQUEST);
      done();
    });
    it('should UNAUTHORIZED if the cookie is not right', async done => {
      const res = await putValidRequestWithCookie(app, URL, 'bad cookie', updatedData);
      expect(res.status).toEqual(UNAUTHORIZED);
      done();
    });
    it('should NOT_FOUND if it cant find the user', async done => {
      await deleteExpertByEmail(email);
      const res = await putValidRequestWithCookie(app, URL, cookie, updatedData);
      expect(res.status).toEqual(NOT_FOUND);
      done();
    });
  });
});
