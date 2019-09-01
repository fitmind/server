import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, OK, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { createAdmin, deleteAdminByEmail, generateAdminValidLogin } from '../../../utils/testing-utils/admin-utils';
import { ListingModelType } from '../../listing/listing.model';
import { deleteListingFromTestById, generateListingForTesting } from '../../../utils/testing-utils/listing-utils';

describe('Admin get listing by id', () => {
  let URL = '';
  let app = createApp(express());
  const email = 'adminlistingretrieve@gmail.com';
  const password = 'Testing123!';
  let cookie: string, listing: ListingModelType;
  const validLogin = generateAdminValidLogin(email, password);

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email, password);
    listing = await generateListingForTesting();
    URL = CONFIG.routes.admin.listingId(listing._id);
    const login = await request(app)
      .post(CONFIG.routes.admin.login)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
    done();
  });
  afterAll(async done => {
    await deleteAdminByEmail(email);
    await deleteListingFromTestById(listing._id);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should allow the admin retrieve the experts in pending status', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(OK);
      expect(res.body._id.toString()).toEqual(listing._id.toString());
      done();
    });
  });

  describe('invalid request', () => {
    it('should return BAD REQUEST if the param is wrong', async done => {
      const badUrl = CONFIG.routes.admin.listingId('badUrl');
      const res = await request(app)
        .get(badUrl)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return NOT_FOUND if the listing doesnt exist', async done => {
      const badUrl = CONFIG.routes.admin.expertId('5d5e62f187f5450ade0c1xxx');
      const res = await request(app)
        .get(badUrl)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });

    it('should return 401 if the authentication failed', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [`${CONFIG.cookies.admin}=wrong_token`]);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 404 if it was not possible to find the admin', async done => {
      await deleteAdminByEmail(email);
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
