import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, CREATED, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { ListingModelType } from '../../listing/listing.model';
import UserModel, { UserModelType } from '../../user/user.model';
import { ExpertModelType } from '../../expert/expert.model';
import BookingModel, { BookingModelType } from '../booking.model';
import {
  deleteCustomerUserById,
  generateCustomerUserValidLogin,
  generateCustomerUserValidSignUp
} from '../../../utils/testing-utils/customer-user-utils';
import { deleteExpertByEmail, generateExpertForTesting } from '../../../utils/testing-utils/expert-user-utils';
import {
  approveListingInTesting,
  deleteListingFromTestById,
  generateListingForTesting
} from '../../../utils/testing-utils/listing-utils';
import { deleteBookingById } from '../../../utils/testing-utils/booking-utils';

describe('Create Booking', () => {
  let URL: string;
  let app = createApp(express());
  const expertEmail = 'createbookingexpert@mail.com';
  const customerEmail = 'createbookinguser@mail.com';
  let cookie: string, login, listing: ListingModelType, expert: ExpertModelType, user: UserModelType;
  const validSignUp = generateCustomerUserValidSignUp(customerEmail);
  const validLogin = generateCustomerUserValidLogin(customerEmail);
  const validBooking = { time: '2019-08-30T17:08:28.203Z' };

  beforeAll(async done => {
    await setTestingDbConnection();
    await request(app)
      .post(CONFIG.routes.user.signUp)
      .send(validSignUp);
    login = await request(app)
      .post(CONFIG.routes.user.login)
      .send(validLogin);
    user = (await UserModel.findOne({ email: customerEmail })) as UserModelType;
    cookie = login.header['set-cookie'][0];
    expert = await generateExpertForTesting(expertEmail);
    listing = await generateListingForTesting(expert.id);
    await approveListingInTesting(listing.id);
    URL = CONFIG.routes.bookings.new(listing.id);
    done();
  });
  afterAll(async done => {
    await deleteExpertByEmail(expertEmail);
    await deleteListingFromTestById(listing.id);
    await deleteCustomerUserById(user._id);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should create a new booking in the DB with all the ids', async done => {
      const res = await request(app)
        .post(URL)
        .set('Cookie', [cookie])
        .send(validBooking);
      expect(res.status).toBe(CREATED);
      const booking = (await BookingModel.findOne({ customer: user.id })) as BookingModelType;
      expect(booking.expert.toString()).toEqual(expert.id.toString());
      expect(booking.listing.toString()).toEqual(listing.id.toString());
      await deleteBookingById(booking.id);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async done => {
      const res = await request(app)
        .post(URL)
        .set('Cookie', [`${CONFIG.cookies.user}=wrong_token`])
        .send(validBooking);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 400 if the body of the request is not right', async done => {
      const res = await request(app)
        .post(URL)
        .set('Cookie', [cookie])
        .send({ wrong: 'body' });
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return 404 if the listing doesnt exist', async done => {
      await deleteListingFromTestById(listing.id);
      const res = await request(app)
        .post(URL)
        .set('Cookie', [cookie])
        .send(validBooking);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
