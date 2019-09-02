import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, CREATED, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import ListingModel, { ListingModelType } from '../listing.model';
import {
  deleteExpertByEmail,
  loginExpertUser,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';
import { deleteListingFromTestById, generateListingValidBody } from '../../../utils/testing-utils/listing-utils';
import { getCookieFromHeader, postValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Create Listing', () => {
  let URL: string = CONFIG.routes.listing.new;
  let app = createApp(express());
  const expertEmail = 'createlistingexpert@mail.com';
  let cookie: string, login;
  let listingValidBody = generateListingValidBody();

  beforeAll(async done => {
    await setTestingDbConnection();
    await registerExpertUser(app, expertEmail);
    login = await loginExpertUser(app, expertEmail);
    cookie = getCookieFromHeader(login);
    done();
  });
  afterAll(async done => {
    await deleteExpertByEmail(expertEmail);
    const listing = (await ListingModel.findOne({ name: listingValidBody.name })) as ListingModelType;
    await deleteListingFromTestById(listing.id);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should change the expert approval status to APPROVED if is true', async done => {
      const res = await postValidRequestWithCookie(app, URL, cookie, listingValidBody);
      expect(res.status).toBe(CREATED);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async done => {
      const res = await postValidRequestWithCookie(app, URL, 'invalid-cookie', listingValidBody);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 400 if the body of the request is not right', async done => {
      const res = await postValidRequestWithCookie(app, URL, cookie, { wrong: 'body' });
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return 404 if the expert doesnt exist', async done => {
      await deleteExpertByEmail(expertEmail);
      const res = await postValidRequestWithCookie(app, URL, cookie, listingValidBody);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
