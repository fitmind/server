import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import CONFIG from '../../../config/config';
import { createApprovedExpert } from '../../../utils/testing-utils/admin-utils';
import { generateListingValidBody, getRandomPrice } from '../../../utils/testing-utils/listing-utils';
import ListingModel, { ListingModelType } from '../listing.model';
import { ExpertModelType } from '../../expert/expert.model';
import createApp from '../../../App';
import express from 'express';
import { deleteExpertById } from '../../../utils/testing-utils/testing-utils';
import request from 'supertest';
import { OK } from 'http-status-codes';

describe('get listings', () => {
  const expertEmail = 'getlistingsexpert@mail.com';
  let expert: ExpertModelType;
  let app = createApp(express());
  const defaultUrl = CONFIG.routes.listing.getListings('');

  beforeAll(async done => {
    await setTestingDbConnection();

    expert = (await createApprovedExpert(expertEmail)) as ExpertModelType;
    const expertises = Object.keys(CONFIG.expertise);
    const listingsArray = expertises.map(expertise => {
      return generateListingValidBody(expert.id, CONFIG.ApprovedStatus.APPROVED, expertise, getRandomPrice(140, 160));
    });
    await ListingModel.insertMany([
      ...listingsArray,
      ...listingsArray,
      ...listingsArray,
      ...listingsArray,
      ...listingsArray
    ]);
    await ListingModel.updateMany({ createdByExpert: expert.id }, { approvedStatus: CONFIG.ApprovedStatus.APPROVED });

    done();
  });
  afterAll(async done => {
    await ListingModel.deleteMany({ createdByExpert: expert.id });
    await deleteExpertById(expert.id);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should return 10 listings with no query params', async done => {
      const res = await request(app).get(defaultUrl);
      expect(res.status).toEqual(OK);
      expect(res.body).toHaveLength(10);
      done();
    });
    it('should return more than 10 if specified in size', async done => {
      const res = await request(app).get(defaultUrl + 'size=20');
      expect(res.status).toEqual(OK);
      expect(res.body).toHaveLength(20);
      done();
    });
    it('should return the next set if specified in page', async done => {
      const res = await request(app).get(defaultUrl + 'size=5&page=1');
      expect(res.status).toEqual(OK);
      expect(res.body).toHaveLength(5);
      const firstPage = res.body.map((listing: ListingModelType) => listing._id);

      const res2 = await request(app).get(defaultUrl + 'size=5&page=2');
      expect(res2.status).toEqual(OK);
      expect(res2.body).toHaveLength(5);
      const secondPage = res2.body.map((listing: ListingModelType) => listing._id);
      expect(firstPage[0] !== secondPage[0]).toBeTruthy();
      expect(firstPage[4] !== secondPage[4]).toBeTruthy();
      done();
    });
    it('should return only listings after a certain price if specified in min_price', async done => {
      const insertBelow150 = generateListingValidBody(
        expert.id,
        CONFIG.ApprovedStatus.APPROVED,
        CONFIG.ApprovedStatus.APPROVED,
        getRandomPrice(140, 149)
      );
      await ListingModel.create(insertBelow150);
      await ListingModel.updateMany({ createdByExpert: expert.id }, { approvedStatus: CONFIG.ApprovedStatus.APPROVED });

      const res = await request(app).get(defaultUrl + 'size=20&page=1&min_price=150');
      expect(res.status).toEqual(OK);
      const filtered = res.body.filter((l: ListingModelType) => parseInt(l.price) < 150);
      expect(filtered).toHaveLength(0);
      done();
    });
    it('should return only listings after a certain price if specified in max_price', async done => {
      const insertAbove150 = generateListingValidBody(
        expert.id,
        CONFIG.ApprovedStatus.APPROVED,
        CONFIG.ApprovedStatus.APPROVED,
        getRandomPrice(151, 160)
      );
      await ListingModel.create(insertAbove150);
      await ListingModel.updateMany({ createdByExpert: expert.id }, { approvedStatus: CONFIG.ApprovedStatus.APPROVED });

      const res = await request(app).get(defaultUrl + 'size=20&page=1&max_price=150');
      expect(res.status).toEqual(OK);
      const filtered = res.body.filter((l: ListingModelType) => parseInt(l.price) > 150);
      expect(filtered).toHaveLength(0);
      done();
      done();
    });
    it('should return only listings after that are in the bracket of both prices', async done => {
      const insertAbove150 = generateListingValidBody(
        expert.id,
        CONFIG.ApprovedStatus.APPROVED,
        CONFIG.ApprovedStatus.APPROVED,
        getRandomPrice(155, 160)
      );
      await ListingModel.create(insertAbove150);
      await ListingModel.updateMany({ createdByExpert: expert.id }, { approvedStatus: CONFIG.ApprovedStatus.APPROVED });

      const res = await request(app).get(defaultUrl + 'size=20&page=1&min_price=155&max_price=160');
      expect(res.status).toEqual(OK);
      const filtered = res.body.filter((l: ListingModelType) => parseInt(l.price) < 155 || parseInt(l.price) > 160);
      expect(filtered).toHaveLength(0);
      done();
    });
    it('should return only a certain expertise if in query param', async done => {
      const expertise = CONFIG.expertise.PERSONAL_COACH;
      const res = await request(app).get(defaultUrl + `size=5&page=1&expertise=${expertise}`);
      expect(res.status).toEqual(OK);
      const filtered = res.body.filter((x: ListingModelType) => x.expertiseArea === expertise);
      expect(filtered).toHaveLength(5);
      done();
    });
    it('should return an empty array if the page is out of bound', async done => {
      const res = await request(app).get(defaultUrl + `size=5&page=100000`);
      expect(res.status).toEqual(OK);
      expect(res.body).toHaveLength(0);
      done();
    });
  });
});
