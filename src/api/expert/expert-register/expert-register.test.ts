import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { CONFLICT, CREATED, BAD_REQUEST } from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import CONFIG from '../../../config/config';
import ExpertModel, { ExpertModelType } from '../expert.model';
import { deleteExpertByEmail, expertValidSignUp } from '../../../utils/testing-utils/testing-utils';

const URL = CONFIG.routes.expert.register;

describe('expert register test', () => {
  let app: express.Application;
  const email = 'expert1212register@gmail.com';
  const validSignUp = expertValidSignUp(email);

  beforeAll(async () => {
    app = createApp(express());
    await setTestingDbConnection();
  });
  afterAll(async () => {
    await deleteExpertByEmail(email);
    await disconnectTestingDb();
  });

  describe('expert register', () => {
    describe('valid user', () => {
      it('should allow the user to be registered and the password should be encrypted', async done => {
        await deleteExpertByEmail(email);
        const res = await request(app)
          .post(URL)
          .send(validSignUp);

        expect(res.status).toEqual(CREATED);
        const createdUser = (await ExpertModel.findOne({ email })) as ExpertModelType;
        const isPasswordMatching = await bcrypt.compare(validSignUp.password, createdUser.password);
        expect(isPasswordMatching).toBeTruthy();
        done();
      });
    });

    describe('invalid user', () => {
      it('should return bad request if the data is malformed', async done => {
        const invalidSignUp = {
          name: 'invalid',
          email,
          description: 13,
          password: 12
        };
        const res = await request(app)
          .post(URL)
          .send(invalidSignUp);
        expect(res.status).toEqual(BAD_REQUEST);
        done();
      });
      it('should return conflict if the email already exists', async done => {
        const res = await request(app)
          .post(URL)
          .send(validSignUp);
        expect(res.status).toEqual(CONFLICT);
        done();
      });
    });
  });
});
