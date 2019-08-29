import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, OK, UNAUTHORIZED } from 'http-status-codes';
import CONFIG from '../../../config/config';
import {
  createAdmin,
  deleteAdminByEmail,
  generateAdminValidLogin,
  generateListingForTesting,
  deleteListingFromTestById
} from '../../../utils/testing-utils/testing-utils';
import ListingModel, { ListingModelType } from '../../listing/listing.model';
import { includes } from 'ramda';

describe('Admin pending expert', () => {
  const URL = CONFIG.routes.admin.listingsPending;
  let app = createApp(express());
  const email = 'adminexpertpending@gmail.com';
  const password = 'Testing123!';
  let cookie: string, login, approvedListing: ListingModelType, pendingListing: ListingModelType;
  const validLogin = generateAdminValidLogin(email, password);

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email, password);
    login = await request(app)
      .post(CONFIG.routes.admin.login)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
    pendingListing = await ListingModel.create(generateListingForTesting());
    approvedListing = await ListingModel.create(generateListingForTesting());
    await ListingModel.findByIdAndUpdate(approvedListing.id, { approvedStatus: CONFIG.ApprovedStatus.APPROVED });
    done();
  });
  afterAll(async done => {
    await deleteAdminByEmail(email);
    await deleteListingFromTestById(pendingListing.id);
    await deleteListingFromTestById(approvedListing.id);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should allow the admin retrieve the experts in pending status', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      const ids = res.body.listings.map((listing: ListingModelType) => listing._id);
      expect(includes(approvedListing.id, ids)).toBeFalsy();
      expect(includes(pendingListing.id, ids)).toBeTruthy();
      expect(res.status).toBe(OK);
      done();
    });
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
