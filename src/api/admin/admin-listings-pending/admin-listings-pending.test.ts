import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, OK, UNAUTHORIZED } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { createAdmin, deleteAdminByEmail, loginAdminUser } from '../../../utils/testing-utils/admin-utils';
import { ListingModelType } from '../../listing/listing.model';
import { includes } from 'ramda';
import {
  deleteListingFromTestById,
  generateListingForTesting,
  approveListingForTesting
} from '../../../utils/testing-utils/listing-utils';
import { getCookieFromHeader, getValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Admin pending expert', () => {
  const URL = CONFIG.routes.admin.listingsPending;
  let app = createApp(express());
  const email = 'adminexpertpending@gmail.com';
  let cookie: string, login, approvedListing: ListingModelType, pendingListing: ListingModelType;

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email);
    login = await loginAdminUser(app, email);
    cookie = getCookieFromHeader(login);
    pendingListing = await generateListingForTesting();
    approvedListing = await generateListingForTesting();
    await approveListingForTesting(approvedListing.id);
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
      const res = await getValidRequestWithCookie(app, URL, cookie);
      const ids = res.body.listings.map((listing: ListingModelType) => listing._id);
      expect(includes(approvedListing.id, ids)).toBeFalsy();
      expect(includes(pendingListing.id, ids)).toBeTruthy();
      expect(res.status).toBe(OK);
      done();
    });
  });

  it('should return 401 if the authentication failed', async done => {
    const res = await getValidRequestWithCookie(app, URL, 'wrong-cookie');
    expect(res.status).toBe(UNAUTHORIZED);
    done();
  });

  it('should return 404 if it was not possible to find the admin', async done => {
    await deleteAdminByEmail(email);
    const res = await getValidRequestWithCookie(app, URL, cookie);
    expect(res.status).toBe(NOT_FOUND);
    done();
  });
});
