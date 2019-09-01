import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { ListingModelType } from '../listing.model';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import {
  deleteExpertByEmail,
  generateExpertUserValidSignUp,
  generateExpertValidLogin
} from '../../../utils/testing-utils/expert-user-utils';
import { deleteListingFromTestById, generateListingForTesting } from '../../../utils/testing-utils/listing-utils';

describe('Delete listing by ID', () => {
  let URL: string;
  let app = createApp(express());
  let listing: ListingModelType;
  const expertEmail = 'deletelisting@mail.com';
  const expertBadEmail = 'deletelistingbad@mail.com';
  let cookie: string;
  let cookie2: string;

  beforeAll(async done => {
    await setTestingDbConnection();
    await request(app)
      .post(CONFIG.routes.expert.register)
      .send(generateExpertUserValidSignUp(expertEmail));
    const expert = (await ExpertModel.findOne({ email: expertEmail })) as ExpertModelType;
    const login = await request(app)
      .post(CONFIG.routes.expert.login)
      .send(generateExpertValidLogin(expertEmail));
    cookie = login.header['set-cookie'][0];

    listing = (await generateListingForTesting(expert._id)) as ListingModelType;

    // generating user 2 so I can send an incorrect cookie in the request to test
    await request(app)
      .post(CONFIG.routes.expert.register)
      .send(generateExpertUserValidSignUp(expertBadEmail));
    const login2 = await request(app)
      .post(CONFIG.routes.expert.login)
      .send(generateExpertValidLogin(expertBadEmail));
    cookie2 = login2.header['set-cookie'][0];

    URL = CONFIG.routes.listing.deleteById(listing.id);
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
      const badUrl = CONFIG.routes.listing.deleteById('123');
      const res = await request(app)
        .delete(badUrl)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return BAD_REQUEST if the param id passed does not exist', async done => {
      const badUrl = CONFIG.routes.listing.deleteById('5d668256beeef0141567dxxx');
      const res = await request(app)
        .delete(badUrl)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return UNAUTHORIZED if the listing does not belongs to the expert', async done => {
      const res = await request(app)
        .delete(URL)
        .set('Cookie', [cookie2]);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });
  });

  describe('valid request', () => {
    it('should retrieve a 200 if the listing was deleted successfully', async done => {
      const res = await request(app)
        .delete(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(OK);
      done();
    });
  });
});
