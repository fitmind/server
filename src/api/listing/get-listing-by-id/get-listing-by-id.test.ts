import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { BAD_REQUEST, OK } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { generateListingValidBody, deleteListingFromTestById } from '../../../utils/testing-utils/testing-utils';
import ListingModel, { ListingModelType } from '../listing.model';

describe('Get listing by ID', () => {
  let URL: string;
  let app = createApp(express());
  let validListing: ListingModelType, invalidListing: ListingModelType;

  beforeAll(async done => {
    await setTestingDbConnection();
    validListing = await ListingModel.create({
      ...generateListingValidBody(),
      approvedStatus: CONFIG.ApprovedStatus.APPROVED
    });
    invalidListing = await ListingModel.create(generateListingValidBody());
    URL = CONFIG.routes.listing.getById(validListing.id);
    done();
  });
  afterAll(async done => {
    await deleteListingFromTestById(validListing.id);
    await deleteListingFromTestById(invalidListing.id);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should retrieve the listing if it is approved', async done => {
      const res = await request(app).get(URL);
      expect(res.status).toBe(OK);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 400 if the listing has not been approved', async done => {
      const badUrl = CONFIG.routes.listing.getById(invalidListing.id);
      const res = await request(app).get(badUrl);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return BAD_REQUEST if the param id is wrong', async done => {
      const badUrl = CONFIG.routes.listing.getById('123');
      const res = await request(app).get(badUrl);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return BAD_REQUEST if the param id passed does not exist', async done => {
      const badUrl = CONFIG.routes.listing.getById('5d668256beeef0141567dxxx');
      const res = await request(app).get(badUrl);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });
  });
});
