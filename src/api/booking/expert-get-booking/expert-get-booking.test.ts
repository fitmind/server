import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, UNAUTHORIZED, OK } from 'http-status-codes';
import CONFIG from '../../../config/config';
import {
  deleteExpertByEmail,
  deleteListingFromTestById,
  generateListingForTesting,
  deleteUserById,
  deleteBookingById,
  approveListingInTesting,
  generateBookingForTesting,
  generateExpertValidSignUp,
  generateExpertLogin,
  generateUserForTesting
} from '../../../utils/testing-utils/testing-utils';
import { ListingModelType } from '../../listing/listing.model';
import { UserModelType } from '../../user/user.model';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import { BookingModelType } from '../booking.model';

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
  const validSignUp = generateExpertValidSignUp(expertEmail);
  const validLogin = generateExpertLogin(expertEmail);

  beforeAll(async done => {
    await setTestingDbConnection();
    await request(app)
      .post(CONFIG.routes.expert.register)
      .send(validSignUp);
    expert = (await ExpertModel.findOne({ email: expertEmail })) as ExpertModelType;
    console.log(expert);
    login = await request(app)
      .post(CONFIG.routes.expert.login)
      .send(validLogin);
    console.log(login.body);
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
    await deleteUserById(user._id);
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
