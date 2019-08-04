import request from 'supertest';
import express from 'express';
import createApp from '../../App';
import mongoose from 'mongoose';

describe('User controller test', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp(express());
    mongoose.connect(process.env.mongoUrl || '', {
      useNewUrlParser: true,
    });
  });
  afterAll(() => {
    mongoose.disconnect();
  });
  describe('User register', () => {
    describe('valid user', () => {
      it('should allow the user to be registered', async () => {
        const validSignUp = {
          name: 'Diego',
          email: 'diego@testing.com',
          description: 'some long string',
          password: 'ValidPassword123!',
          interestedInExperiseAreas: ['PERSONAL_COACH'],
        };
        // I can check that I'm receiving the right response and that the DB has been updated accordingly
        const res = await request(app)
          .post('/user/register')
          .send(validSignUp);
        expect(res.status).toBe(201);
      });
    });

    describe('invalid user', () => {
      it('should throw a 400 if any of the data is invalid', async () => {
        const validSignUp = {
          name: 123,
          email: 'diego@testing.com',
          description: 'some long string',
          password: 'ValidPassword123!',
          interestedInExperiseAreas: ['PERSONAL_COACH'],
        };
        // I can check that I'm receiving the right response and that the DB has been updated accordingly
        const res = await request(app)
          .post('/user/register')
          .send(validSignUp);
        expect(res.status).toBe(400);
      });
      it('should throw a 400 if any of the data is missing', async () => {
        const validSignUp = {
          name: 'Diego',
          description: 'some long string',
          password: 'ValidPassword123!',
          interestedInExperiseAreas: ['PERSONAL_COACH'],
        };
        // I can check that I'm receiving the right response and that the DB has been updated accordingly
        const res = await request(app)
          .post('/user/register')
          .send(validSignUp);
        expect(res.status).toBe(400);
      });
    });
  });
});
