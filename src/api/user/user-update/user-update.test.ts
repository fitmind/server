import request from 'supertest';
import express from 'express';
import createApp from '../../../App';
import UserModel, { UserModelType } from '../user.model';
import CONFIG from '../../../config/config';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import {
  deleteFromDbByEmail,
  userTestPassword,
  userValidLogin,
  userValidSignUp
} from '../../../utils/testing-utils/testing-utils';

const URL = CONFIG.routes.user.me;
const SIGN_UP_URL = CONFIG.routes.user.signUp;
const LOGIN_URL = CONFIG.routes.user.login;

describe('User update', () => {
  let app: express.Application;
  const email = 'updateUser@gmail.com';
  const validSignUp = userValidSignUp(email);
  const validLogin = userValidLogin(email);
  let login = null;
  let cookie: string;

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
    await deleteFromDbByEmail(email);
    await disconnectTestingDb();
  });

  describe('user update', () => {
    describe('valid user', () => {
      it('should update the user in the database', async () => {
        const newDescription = 'NEW UPDATED DESCRIPTION';
        const validUpdate = {
          name: 'Diego',
          email,
          description: newDescription,
          password: userTestPassword,
          pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
          interestedInExpertiseAreas: ['PERSONAL_COACH']
        };
        const res = await request(app)
          .put(URL)
          .set('Cookie', [cookie])
          .send(validUpdate);
        const user = (await UserModel.findOne({ email }).exec()) as UserModelType;
        expect(res.status).toEqual(OK);
        expect(user.description).toBe(newDescription);
      });
    });
    describe('invalid data', () => {
      const validUpdate = {
        name: 'Diego',
        email,
        description: 'newDescription',
        password: userTestPassword,
        pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
        interestedInExpertiseAreas: ['PERSONAL_COACH']
      };
      it('should fail if the cookie is not in the request', async () => {
        const res = await request(app)
          .put(URL)
          .set('Cookie', ['bad cookie'])
          .send(validUpdate);
        expect(res.status).toEqual(UNAUTHORIZED);
      });
      it('should fail if the data is not acceptable', async () => {
        const inValidUpdate = {
          name: 'Diego',
          email,
          description: 1,
          password: userTestPassword,
          pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
          interestedInExpertiseAreas: ['PERSONAL_COACH']
        };
        const res = await request(app)
          .put(URL)
          .set('Cookie', [cookie])
          .send(inValidUpdate);
        expect(res.status).toEqual(BAD_REQUEST);
      });
    });
  });
});
