import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import {
  getCookieFromHeader,
  putValidRequestWithCookie,
  testingPictureUrl,
  userTestPassword
} from '../../../utils/testing-utils/testing-utils';
import {
  deleteCustomerUserFromDbByEmail,
  getCustomerUserByEmail,
  loginCustomerUser,
  registerCustomerUser
} from '../../../utils/testing-utils/customer-user-utils';

const URL = CONFIG.routes.user.me;

describe('User update', () => {
  let app: express.Application;
  const email = 'updateUser@gmail.com';
  let login = null;
  let cookie: string;
  const newDescription = 'NEW UPDATED DESCRIPTION';
  const validUpdate = {
    name: 'Diego',
    email,
    description: newDescription,
    password: userTestPassword,
    pictureUrl: testingPictureUrl,
    interestedInExpertiseAreas: ['PERSONAL_COACH']
  };

  beforeAll(async done => {
    app = createApp(express());
    await setTestingDbConnection();
    await registerCustomerUser(app, email);
    login = await loginCustomerUser(app, email);
    cookie = getCookieFromHeader(login);
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
        const res = await putValidRequestWithCookie(app, URL, cookie, validUpdate);
        const user = await getCustomerUserByEmail(email);
        expect(res.status).toEqual(OK);
        expect(user.description).toBe(newDescription);
        done();
      });
    });
    describe('invalid data', () => {
      it('should fail if the cookie is not in the request', async done => {
        const res = await putValidRequestWithCookie(app, URL, 'bad-cookie', validUpdate);
        expect(res.status).toEqual(UNAUTHORIZED);
        done();
      });
      it('should fail if the data is not acceptable', async done => {
        const inValidUpdate = {
          name: 'Diego',
          email,
          description: 1,
          password: userTestPassword,
          pictureUrl: testingPictureUrl,
          interestedInExpertiseAreas: ['PERSONAL_COACH']
        };
        const res = await putValidRequestWithCookie(app, URL, cookie, inValidUpdate);
        expect(res.status).toEqual(BAD_REQUEST);
        done();
      });
    });
  });
});
