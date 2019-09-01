import request from 'supertest';
import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import { BAD_REQUEST, CREATED, CONFLICT } from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import {
  deleteCustomerUserFromDbByEmail,
  generateCustomerUserValidSignUp,
  getCustomerUserByEmail,
  registerCustomerUser
} from '../../../utils/testing-utils/customer-user-utils';

const URL = CONFIG.routes.user.signUp;

describe('User register test', () => {
  let app: express.Application;
  const email = 'registrationfitmind@gmail.com';
  const validSignUp = generateCustomerUserValidSignUp(email);

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
  });
  afterAll(async () => {
    await deleteCustomerUserFromDbByEmail(email);
    await disconnectTestingDb();
  });
  describe('User register', () => {
    describe('valid user', () => {
      it('should allow the user to be registered and the password should be encrypted', async done => {
        await deleteCustomerUserFromDbByEmail(email);
        const res = await registerCustomerUser(app, email);
        expect(res.status).toEqual(CREATED);
        const createdUser = await getCustomerUserByEmail(email);
        const isPasswordMatching = await bcrypt.compare(validSignUp.password, createdUser.password);
        expect(isPasswordMatching).toBeTruthy();
        done();
      });
    });

    describe('invalid user', () => {
      describe('malformed data', () => {
        it('invalid', async done => {
          const res = await request(app)
            .post(URL)
            .send({ ...validSignUp, name: 123 });
          expect(res.status).toBe(BAD_REQUEST);
          done();
        });
        it('should return CONFLICT if the email is already in use', async done => {
          const res = await request(app)
            .post(URL)
            .send(validSignUp);
          expect(res.status).toBe(CONFLICT);
          done();
        });
      });
    });
  });
});
