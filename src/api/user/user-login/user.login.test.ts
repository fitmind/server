import express from 'express';
import createApp from '../../../App';
import UserModel from '../user.model';
import mongoose from 'mongoose';
import CONFIG from '../../../config/config';
import request from 'supertest';
import { omit } from 'ramda';
import { BAD_REQUEST, NOT_FOUND, CREATED, UNAUTHORIZED } from 'http-status-codes';

describe('User Login', () => {
  const URL = CONFIG.routes.user.login;
  const SIGN_UP_URL = CONFIG.routes.user.signUp;
  const email = 'diego.login@testing.com';
  let app: express.Application;
  const password = 'ValidPassword123!';
  let validRequestPost = { email, password };
  const validSignUp = {
    name: 'Diego',
    email,
    description: 'some long string',
    password,
    interestedInExpertiseAreas: ['PERSONAL_COACH']
  };

  beforeAll(async () => {
    app = createApp(express());
    mongoose.connect(process.env.MONGO_TESTING_URL || '', {
      useNewUrlParser: true
    });
    await request(app)
      .post(SIGN_UP_URL)
      .send(validSignUp);
  });
  afterAll(async () => {
    await UserModel.findOneAndDelete({ email });
    await mongoose.disconnect();
  });
  describe('valid request', () => {
    it('should return a 201 along with an authorization cookie', async done => {
      const res = await request(app)
        .post(URL)
        .send(validRequestPost);
      const cookie = res.header['set-cookie'][0];
      expect(res.status).toBe(CREATED);
      expect(cookie.includes(CONFIG.cookies.user)).toBeTruthy();
      done();
    });
  });

  describe('invalid request', () => {
    describe('email', () => {
      it('should return 404 if email is not found', async () => {
        const res = await request(app)
          .post(URL)
          .send({ email: 'bad.email@test.com', password });
        expect(res.status).toBe(NOT_FOUND);
      });
      it('should return 400 if email is missing', async () => {
        const res = await request(app)
          .post(URL)
          .send(omit(['email'], validRequestPost));
        expect(res.status).toBe(BAD_REQUEST);
      });
      it('should return 400 if email is not an email', async () => {
        const res = await request(app)
          .post(URL)
          .send({ ...validRequestPost, email: 'broken_email.com' });
        expect(res.status).toBe(BAD_REQUEST);
      });
    });
    it('is missing sending the password', async () => {
      const res = await request(app)
        .post(URL)
        .send(omit(['password'], validRequestPost));
      expect(res.status).toBe(BAD_REQUEST);
    });
    it('should return bad request if the password doesnt match', async () => {
      const res = await request(app)
        .post(URL)
        .send({ email, password: 'wrongPassword' });
      expect(res.status).toBe(UNAUTHORIZED);
    });
  });
});
