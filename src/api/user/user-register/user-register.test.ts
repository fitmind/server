import request from 'supertest';
import express from 'express';
import createApp from '../../../App';
import mongoose from 'mongoose';
import { omit } from 'ramda';
import UserModel from '../user.model';
import CONFIG from '../../../config/config';
import { BAD_REQUEST, CONFLICT, CREATED } from 'http-status-codes';
import * as bcrypt from 'bcrypt';

const URL = CONFIG.routes.user.signUp;

describe('User controller test', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp(express());
    mongoose.connect(process.env.MONGO_TESTING_URL || '', {
      useNewUrlParser: true
    });
  });
  afterAll(async () => {
    await UserModel.findOneAndDelete({ email: 'diego@testing.com' });
    await UserModel.findOneAndDelete({ email: 'default@testing.com' });
    await mongoose.disconnect();
  });
  describe('User register', () => {
    describe('valid user', () => {
      it('should allow the user to be registered and the password should be encrypted', async () => {
        const validSignUp = {
          name: 'Diego',
          email: 'diego@testing.com',
          description: 'some long string',
          password: 'ValidPassword123!',
          interestedInExpertiseAreas: ['PERSONAL_COACH']
        };
        const res = await request(app)
          .post(URL)
          .send(validSignUp);
        expect(res.status).toBe(CREATED);
        const createdUser = (await UserModel.findOne({ email: validSignUp.email })) || { password: '' };
        const isPasswordMatching = await bcrypt.compare(validSignUp.password, createdUser.password);
        expect(isPasswordMatching).toBeTruthy();
      });
    });

    describe('invalid user', () => {
      let defaultBody = {
        name: 'diego',
        email: 'default@testing.com',
        description: 'some long string',
        password: 'ValidPassword123!',
        interestedInExpertiseAreas: ['PERSONAL_COACH']
      };
      describe('name is invalid or missing', () => {
        it('invalid', async () => {
          const res = await request(app)
            .post(URL)
            .send({ ...defaultBody, name: 123 });
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toEqual(
            'name must be longer than or equal to 2 and shorter than or equal to 20 characters,name must be a string'
          );
        });
        it('missing', async () => {
          const res = await request(app)
            .post(URL)
            .send(omit(['name'], defaultBody));
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe('name must be longer than or equal to 2 characters,name must be a string');
        });
      });
      describe('email is invalid or missing', () => {
        it('should return CONFLICT if the email is already in use', async () => {
          await UserModel.create(defaultBody);
          const res = await request(app)
            .post(URL)
            .send(defaultBody);
          expect(res.status).toBe(CONFLICT);
          expect(res.body.message).toEqual('Email is already in use');
        });
        it('invalid', async () => {
          const res = await request(app)
            .post(URL)
            .send({ ...defaultBody, email: 'diego@gmail' });
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe('email must be an email');
        });
        it('missing', async () => {
          const res = await request(app)
            .post(URL)
            .send(omit(['email'], defaultBody));
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe('email must be an email');
        });
      });
      describe('interested in expertise is invalid or missing', () => {
        it('is invalid', async () => {
          const res = await request(app)
            .post(URL)
            .send({ ...defaultBody, interestedInExpertiseAreas: ['not valid string'] });
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(
            'Expertise sent is not one of the valid ones and is necessary to send at least one'
          );
        });
        it('is missing', async () => {
          const res = await request(app)
            .post(URL)
            .send(omit(['interestedInExpertiseAreas'], defaultBody));
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(
            'Expertise sent is not one of the valid ones and is necessary to send at least one'
          );
        });
      });
    });
  });
});
