import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, CREATED, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import {
  deleteExpertByEmail,
  generateExpertLogin,
  generateExpertValidSignUp,
  generateListingValidBody
} from '../../../utils/testing-utils/testing-utils';

describe('Create Listing', () => {
  let URL: string = CONFIG.routes.listing.new;
  let app = createApp(express());
  const expertEmail = 'createlistingexpert@mail.com';
  let cookie: string, login;
  const validSignUp = generateExpertValidSignUp(expertEmail);
  const validLogin = generateExpertLogin(expertEmail);
  let listingValidBody = generateListingValidBody();

  beforeAll(async done => {
    await setTestingDbConnection();
    await request(app)
      .post(CONFIG.routes.expert.register)
      .send(validSignUp);
    login = await request(app)
      .post(CONFIG.routes.expert.login)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
    done();
  });
  afterAll(async done => {
    await deleteExpertByEmail(expertEmail);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should change the expert approval status to APPROVED if is true', async done => {
      console.log(listingValidBody);
      const res = await request(app)
        .post(URL)
        .set('Cookie', [cookie])
        .send(listingValidBody);
      expect(res.status).toBe(CREATED);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async done => {
      const res = await request(app)
        .post(URL)
        .set('Cookie', [`${CONFIG.cookies.admin}=wrong_token`])
        .send({});
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 400 if the body of the request is not right', async done => {
      const res = await request(app)
        .post(URL)
        .set('Cookie', [cookie])
        .send({ wrong: 'body' });
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return 404 if the expert doesnt exist', async done => {
      await deleteExpertByEmail(expertEmail);
      const res = await request(app)
        .post(URL)
        .set('Cookie', [cookie])
        .send(listingValidBody);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
