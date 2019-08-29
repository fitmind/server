import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, OK, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import {
  createAdmin,
  deleteAdminByEmail,
  deleteListingFromTestById,
  generateAdminValidLogin,
  generateListingForTesting
} from '../../../utils/testing-utils/testing-utils';
import ListingModel, { ListingModelType } from '../../listing/listing.model';

describe('Admin listing approve', () => {
  let URL = '';
  let app = createApp(express());
  const email = 'adminlistingapproval@gmail.com';
  const password = 'Testing123!';
  let cookie: string, listing: ListingModelType;
  const validLogin = generateAdminValidLogin(email, password);
  const validApproval = { approved: true };

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email, password);
    listing = await generateListingForTesting();
    URL = CONFIG.routes.admin.approveListingId(listing.id);
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
    it('should change the expert approval status to APPROVED if is true', async done => {
      const res = await request(app)
        .put(URL)
        .set('Cookie', [cookie])
        .send(validApproval);
      expect(res.status).toBe(OK);
      const updatedListing = (await ListingModel.findById(listing.id)) as ListingModelType;
      expect(updatedListing.approvedStatus).toEqual(CONFIG.ApprovedStatus.APPROVED);
      done();
    });
    it('should change the expert approval status to DENIED if false', async done => {
      const res = await request(app)
        .put(URL)
        .set('Cookie', [cookie])
        .send({ approved: false });
      expect(res.status).toBe(OK);
      const updatedListing = (await ListingModel.findById(listing.id)) as ListingModelType;
      expect(updatedListing.approvedStatus).toEqual(CONFIG.ApprovedStatus.DENIED);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return BAD REQUEST if the param is wrong', async done => {
      const badUrl = CONFIG.routes.admin.approveListingId('badUrl');
      const res = await request(app)
        .put(badUrl)
        .set('Cookie', [cookie])
        .send(validApproval);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return NOT_FOUND if the listing doesnt exist', async done => {
      const badUrl = CONFIG.routes.admin.listingId('5d5e62f187f5450ade0c1xxx');
      const res = await request(app)
        .put(badUrl)
        .set('Cookie', [cookie])
        .send(validApproval);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });

    it('should return 401 if the authentication failed', async done => {
      const res = await request(app)
        .put(URL)
        .set('Cookie', [`${CONFIG.cookies.admin}=wrong_token`])
        .send(validApproval);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 400 if the body of the request is not right', async done => {
      const res = await request(app)
        .put(URL)
        .set('Cookie', [cookie])
        .send({ wrong: 'body' });
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return 404 if it was not possible to find the admin', async done => {
      await deleteAdminByEmail(email);
      const res = await request(app)
        .put(URL)
        .set('Cookie', [cookie])
        .send(validApproval);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
