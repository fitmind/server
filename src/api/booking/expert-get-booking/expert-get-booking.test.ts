import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, UNAUTHORIZED, OK } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { ListingModelType } from '../../listing/listing.model';
import { UserModelType } from '../../user/user.model';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import { BookingModelType } from '../booking.model';
import { deleteCustomerUserById, generateUserForTesting } from '../../../utils/testing-utils/customer-user-utils';
import {
  deleteExpertByEmail,
  generateExpertUserValidSignUp,
  generateExpertValidLogin
} from '../../../utils/testing-utils/expert-user-utils';
import {
  approveListingInTesting,
  deleteListingFromTestById,
  generateListingForTesting
} from '../../../utils/testing-utils/listing-utils';
import { deleteBookingById, generateBookingForTesting } from '../../../utils/testing-utils/booking-utils';

describe('Booking get as expert user', () => {
  let URL: string;
  let app = createApp(express());
  const expertEmail = 'expertgetbooking@mail.com';
  const customerEmail = 'usergetbooking@mail.com';
  let cookie: string,
    login,
    listing: ListingModelType,
    expert: ExpertModelType,
    user: UserModelType,
    booking: BookingModelType;
  const validSignUp = generateExpertUserValidSignUp(expertEmail);
  const validLogin = generateExpertValidLogin(expertEmail);

  beforeAll(async done => {
    await setTestingDbConnection();
    await request(app)
      .post(CONFIG.routes.expert.register)
      .send(validSignUp);
    expert = (await ExpertModel.findOne({ email: expertEmail })) as ExpertModelType;
    login = await request(app)
      .post(CONFIG.routes.expert.login)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
    user = (await generateUserForTesting(customerEmail)) as UserModelType;
    listing = await generateListingForTesting(expert.id);
    await approveListingInTesting(listing.id);
    booking = (await generateBookingForTesting(user.id, listing.id, expert.id)) as BookingModelType;
    URL = CONFIG.routes.bookings.getAsExpertById(booking.id);
    done();
  });
  afterAll(async done => {
    await deleteExpertByEmail(expertEmail);
    await deleteListingFromTestById(listing.id);
    await deleteCustomerUserById(user._id);
    await deleteBookingById(booking.id);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should retrieve the booking for the user to see', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(OK);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async done => {
      const res = await request(app)
        .get(URL)
        .set('Cookie', [`${CONFIG.cookies.user}=wrong_token`]);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 404 if the booking doesnt exist', async done => {
      await deleteBookingById(booking.id);
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
