import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { CONFLICT, CREATED, BAD_REQUEST } from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import {
  deleteExpertByEmail,
  generateExpertUserValidSignUp,
  getExpertUserByMail,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';

describe('expert register test', () => {
  let app: express.Application;
  const email = 'expert1212register@gmail.com';
  const validSignUp = generateExpertUserValidSignUp(email);

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
        const res = await registerExpertUser(app, email);

        expect(res.status).toEqual(CREATED);
        const createdUser = await getExpertUserByMail(email);
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
        const res = await registerExpertUser(app, email, invalidSignUp);
        expect(res.status).toEqual(BAD_REQUEST);
        done();
      });
      it('should return conflict if the email already exists', async done => {
        const res = await registerExpertUser(app, email);
        expect(res.status).toEqual(CONFLICT);
        done();
      });
    });
  });
});
