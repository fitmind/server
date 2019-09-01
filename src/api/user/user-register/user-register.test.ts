import request from 'supertest';
import express from 'express';
import createApp from '../../../App';
import { omit } from 'ramda';
import UserModel, { UserModelType } from '../user.model';
import CONFIG from '../../../config/config';
import { BAD_REQUEST, CONFLICT, CREATED } from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import {
  deleteCustomerUserFromDbByEmail,
  generateCustomerUserValidSignUp
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
        const res = await request(app)
          .post(URL)
          .send(validSignUp);
        expect(res.status).toEqual(CREATED);
        const createdUser = (await UserModel.findOne({ email })) as UserModelType;
        const isPasswordMatching = await bcrypt.compare(validSignUp.password, createdUser.password);
        expect(isPasswordMatching).toBeTruthy();
        done();
      });
    });

    describe('invalid user', () => {
      describe('name is invalid or missing', () => {
        it('invalid', async done => {
          const res = await request(app)
            .post(URL)
            .send({ ...validSignUp, name: 123 });
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toEqual(
            'name must be longer than or equal to 2 and shorter than or equal to 20 characters,name must be a string'
          );
          done();
        });
        it('missing', async done => {
          const res = await request(app)
            .post(URL)
            .send(omit(['name'], validSignUp));
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe('name must be longer than or equal to 2 characters,name must be a string');
          done();
        });
      });
      describe('email is invalid or missing', () => {
        it('should return CONFLICT if the email is already in use', async done => {
          await UserModel.create(validSignUp);
          const res = await request(app)
            .post(URL)
            .send(validSignUp);
          expect(res.status).toBe(CONFLICT);
          expect(res.body.message).toEqual('Email is already in use');
          done();
        });
        it('invalid', async done => {
          const res = await request(app)
            .post(URL)
            .send({ ...validSignUp, email: 'diego@gmail' });
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe('email must be an email');
          done();
        });
        it('missing', async done => {
          const res = await request(app)
            .post(URL)
            .send(omit(['email'], validSignUp));
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe('email must be an email');
          done();
        });
      });
      describe('interested in expertise is invalid or missing', () => {
        it('is invalid', async done => {
          const res = await request(app)
            .post(URL)
            .send({ ...validSignUp, interestedInExpertiseAreas: ['not valid string'] });
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(
            'Expertise sent is not one of the valid ones and is necessary to send at least one'
          );
          done();
        });
        it('is missing', async done => {
          const res = await request(app)
            .post(URL)
            .send(omit(['interestedInExpertiseAreas'], validSignUp));
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(
            'Expertise sent is not one of the valid ones and is necessary to send at least one'
          );
          done();
        });
      });
    });
  });
});
