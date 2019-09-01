import request from 'supertest';
import express from 'express';
import createApp from '../../../App';
import UserModel, { UserModelType } from '../user.model';
import CONFIG from '../../../config/config';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { userTestPassword } from '../../../utils/testing-utils/testing-utils';
import {
  deleteCustomerUserFromDbByEmail,
  generateCustomerUserValidLogin,
  generateCustomerUserValidSignUp
} from '../../../utils/testing-utils/customer-user-utils';

const URL = CONFIG.routes.user.me;
const SIGN_UP_URL = CONFIG.routes.user.signUp;
const LOGIN_URL = CONFIG.routes.user.login;

describe('User update', () => {
  let app: express.Application;
  const email = 'updateUser@gmail.com';
  const validSignUp = generateCustomerUserValidSignUp(email);
  const validLogin = generateCustomerUserValidLogin(email);
  let login = null;
  let cookie: string;
  const newDescription = 'NEW UPDATED DESCRIPTION';
  const validUpdate = {
    name: 'Diego',
    email,
    description: newDescription,
    password: userTestPassword,
    pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
    interestedInExpertiseAreas: ['PERSONAL_COACH']
  };

  beforeAll(async done => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
    login = await request(app)
      .post(LOGIN_URL)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
    done();
  });

  afterAll(async done => {
    await deleteCustomerUserFromDbByEmail(email);
    await disconnectTestingDb();
    done();
  });

  describe('user update', () => {
    describe('valid user', () => {
      it('should update the user in the database', async done => {
        const newDescription = 'NEW UPDATED DESCRIPTION';
        const res = await request(app)
          .put(URL)
          .set('Cookie', [cookie])
          .send(validUpdate);
        const user = (await UserModel.findOne({ email }).exec()) as UserModelType;
        expect(res.status).toEqual(OK);
        expect(user.description).toBe(newDescription);
        done();
      });
    });
    describe('invalid data', () => {
      it('should fail if the cookie is not in the request', async done => {
        const res = await request(app)
          .put(URL)
          .set('Cookie', ['bad cookie'])
          .send(validUpdate);
        expect(res.status).toEqual(UNAUTHORIZED);
        done();
      });
      it('should fail if the data is not acceptable', async done => {
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
        done();
      });
    });
  });
});
