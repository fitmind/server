import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { ListingModelType } from '../listing.model';
import {
  deleteExpertByEmail,
  getExpertUserByMail,
  loginExpertUser,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';
import {
  deleteListingFromTestById,
  generateListingForTesting,
  generateListingValidBody
} from '../../../utils/testing-utils/listing-utils';
import { getCookieFromHeader, putValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Update listing by ID', () => {
  let URL: string;
  let app = createApp(express());
  let listing: ListingModelType;
  const expertEmail = 'updatelisting@mail.com';
  const expertBadEmail = 'updatelisting2@mail.com';
  let cookie: string;
  let cookie2: string;
  let listingValidBody = generateListingValidBody();

  beforeAll(async done => {
    await setTestingDbConnection();
    await registerExpertUser(app, expertEmail);
    const expert = await getExpertUserByMail(expertEmail);
    const login = await loginExpertUser(app, expertEmail);
    cookie = getCookieFromHeader(login);

    listing = await generateListingForTesting(expert.id);

    // generating user 2 so I can send an incorrect cookie in the request to test
    await registerExpertUser(app, expertBadEmail);
    const login2 = await loginExpertUser(app, expertBadEmail);
    cookie2 = getCookieFromHeader(login2);

    URL = CONFIG.routes.listing.updateById(listing.id);
    done();
  });
  afterAll(async done => {
    await deleteListingFromTestById(listing.id);
    await deleteExpertByEmail(expertEmail);
    await deleteExpertByEmail(expertBadEmail);
    await disconnectTestingDb();
    done();
  });

  describe('invalid request', () => {
    it('should return BAD_REQUEST if the param id is wrong', async done => {
      const badUrl = CONFIG.routes.listing.updateById('123');
      const res = await putValidRequestWithCookie(app, badUrl, cookie, listingValidBody);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return BAD_REQUEST if the param id passed does not exist', async done => {
      const badUrl = CONFIG.routes.listing.updateById('5d668256beeef0141567dxxx');
      const res = await putValidRequestWithCookie(app, badUrl, cookie, listingValidBody);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return UNAUTHORIZED if the listing does not belongs to the expert', async done => {
      const res = await putValidRequestWithCookie(app, URL, 'bad-cookie', listingValidBody);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });
  });

  describe('valid request', () => {
    it('should retrieve a 200 if the listing was updated successfully', async done => {
      const res = await putValidRequestWithCookie(app, URL, cookie, listingValidBody);
      expect(res.status).toBe(OK);
      done();
    });
  });
});
