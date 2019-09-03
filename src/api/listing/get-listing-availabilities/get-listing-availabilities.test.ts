import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { BAD_REQUEST, OK } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { ListingModelType } from '../listing.model';
import {
  deleteListingFromTestById,
  generateListingForTesting,
  generateValidListingForTesting
} from '../../../utils/testing-utils/listing-utils';
import { ExpertModelType } from '../../expert/expert.model';
import { generateExpertForTesting } from '../../../utils/testing-utils/expert-user-utils';
import { deleteExpertById } from '../../../utils/testing-utils/testing-utils';

describe('Get listing availability by ID', () => {
  let URL: string;
  let app = createApp(express());
  let validListing: ListingModelType, invalidListing: ListingModelType, expert: ExpertModelType;
  const expertEmail = 'listing.availability@gmail.com';

  beforeAll(async done => {
    await setTestingDbConnection();
    expert = await generateExpertForTesting(expertEmail);
    validListing = await generateValidListingForTesting(expert.id);
    invalidListing = await generateListingForTesting();
    URL = CONFIG.routes.listing.getAvailabilityById(validListing.id);
    done();
  });
  afterAll(async done => {
    await deleteExpertById(expert.id);
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
