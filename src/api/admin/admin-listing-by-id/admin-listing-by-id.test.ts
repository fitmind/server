import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, OK, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import {
  createAdmin,
  deleteAdminByEmail,
  generateAdminValidLogin,
  loginAdminUser
} from '../../../utils/testing-utils/admin-utils';
import { ListingModelType } from '../../listing/listing.model';
import { deleteListingFromTestById, generateListingForTesting } from '../../../utils/testing-utils/listing-utils';
import { getCookieFromHeader, getValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Admin get listing by id', () => {
  let URL = '';
  let app = createApp(express());
  const email = 'adminlistingretrieve@gmail.com';
  let cookie: string, listing: ListingModelType;
  generateAdminValidLogin(email);

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email);
    listing = await generateListingForTesting();
    URL = CONFIG.routes.admin.listingId(listing._id);
    const login = await loginAdminUser(app, email);
    cookie = getCookieFromHeader(login);
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
      const res = await getValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toBe(OK);
      expect(res.body._id.toString()).toEqual(listing._id.toString());
      done();
    });
  });

  describe('invalid request', () => {
    it('should return BAD REQUEST if the param is wrong', async done => {
      const badUrl = CONFIG.routes.admin.listingId('badUrl');
      const res = await getValidRequestWithCookie(app, badUrl, cookie);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return NOT_FOUND if the listing doesnt exist', async done => {
      const badUrl = CONFIG.routes.admin.expertId('5d5e62f187f5450ade0c1xxx');
      const res = await getValidRequestWithCookie(app, badUrl, cookie);
      expect(res.status).toBe(NOT_FOUND);
      done();
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
});
