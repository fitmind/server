import createApp from '../../../App';
import express from 'express';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { OK, UNAUTHORIZED, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import {
  deleteExpertByEmail,
  loginExpertUser,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';

describe('expert login', () => {
  let app = createApp(express());
  const email = 'expertregister@mail.com';

  beforeAll(async done => {
    await setTestingDbConnection();
    await registerExpertUser(app, email);
    done();
  });

  afterAll(async done => {
    await disconnectTestingDb();
    await deleteExpertByEmail(email);
    done();
  });

  describe('valid login', () => {
    it('returns OK on valid login', async done => {
      const res = await loginExpertUser(app, email);
      expect(res.status).toEqual(OK);
      done();
    });
  });

  describe('invalid login', () => {
    it('should return BAD_REQUEST if data is invalid', async done => {
      const res = await loginExpertUser(app, email, { bad: 'field' });
      expect(res.status).toEqual(BAD_REQUEST);
      done();
    });
    it('should return unauthorized if passwords dont match', async done => {
      const res = await loginExpertUser(app, email, { email, password: 'badPassword' });
      expect(res.status).toEqual(UNAUTHORIZED);
      done();
    });
    it('should return NOT_FOUND if the user doesnt exist', async done => {
      await deleteExpertByEmail(email);
      const notFound = { email: 'notfound@mail.com', password: 'Testing123!' };
      const res = await loginExpertUser(app, email, notFound);
      expect(res.status).toEqual(NOT_FOUND);
      done();
    });
  });
});
