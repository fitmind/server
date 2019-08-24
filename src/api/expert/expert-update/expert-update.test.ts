import express from 'express';
import {
  deleteExpertByEmail,
  generateExpertLogin,
  generateExpertValidSignUp
} from '../../../utils/testing-utils/testing-utils';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import CONFIG from '../../../config/config';
import { UNAUTHORIZED, BAD_REQUEST, OK, NOT_FOUND } from 'http-status-codes';
import ExpertModel, { ExpertModelType } from '../expert.model';

describe('expert update', () => {
  const URL = CONFIG.routes.expert.me;
  const SIGN_UP_URL = CONFIG.routes.expert.register;
  const LOGIN_URL = CONFIG.routes.expert.login;
  let app: express.Application;
  const email = 'updateexpert@gmail.com';
  const validSignUp = generateExpertValidSignUp(email);
  const validLogin = generateExpertLogin(email);
  let login, cookie: string;
  const updateFirstName = 'Jose';
  const validUpdate = {
    firstName: 'Diego',
    lastName: 'Romero',
    description: 'some long string',
    pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
    isAnExpertIn: ['PERSONAL_COACH'],
    weeklyAvailability: {
      monday: ['6:00', '6:30'],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  };

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
    login = await request(app)
      .post(LOGIN_URL)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
  });

  afterAll(async () => {
    await deleteExpertByEmail(email);
    await disconnectTestingDb();
  });

  describe('valid', () => {
    it('should return OK if the expert has been updated', async done => {
      const res = await request(app)
        .put(URL)
        .set('Cookie', [cookie])
        .send({ ...validUpdate, firstName: updateFirstName });
      expect(res.status).toEqual(OK);
      const expert = (await ExpertModel.findOne({ email }).exec()) as ExpertModelType;
      expect(expert.firstName).toEqual(updateFirstName);
      done();
    });
  });

  describe('invalid', () => {
    it('should BAD_REQUEST if the data is invalid', async done => {
      const res = await request(app)
        .put(URL)
        .set('Cookie', [cookie])
        .send({ ...validUpdate, firstName: 123 });
      expect(res.status).toEqual(BAD_REQUEST);
      done();
    });
    it('should UNAUTHORIZED if the cookie is not right', async done => {
      const res = await request(app)
        .put(URL)
        .set('Cookie', ['bad cookie'])
        .send(validUpdate);
      expect(res.status).toEqual(UNAUTHORIZED);
      done();
    });
    it('should NOT_FOUND if it cant find the user', async done => {
      await deleteExpertByEmail(email);
      const res = await request(app)
        .put(URL)
        .set('Cookie', [cookie])
        .send(validUpdate);
      expect(res.status).toEqual(NOT_FOUND);
      done();
    });
  });
});
