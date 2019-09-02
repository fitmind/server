import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, CREATED, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { ListingModelType } from '../../listing/listing.model';
import { UserModelType } from '../../user/user.model';
import { ExpertModelType } from '../../expert/expert.model';
import {
  deleteCustomerUserById,
  getCustomerUserByEmail,
  loginCustomerUser,
  registerCustomerUser
} from '../../../utils/testing-utils/customer-user-utils';
import { deleteExpertByEmail, generateExpertForTesting } from '../../../utils/testing-utils/expert-user-utils';
import {
  approveListingInTesting,
  deleteListingFromTestById,
  generateListingForTesting
} from '../../../utils/testing-utils/listing-utils';
import { deleteBookingById, getBookingByCustomerId } from '../../../utils/testing-utils/booking-utils';
import { getCookieFromHeader, postValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Create Booking', () => {
  let URL: string;
  let app = createApp(express());
  const expertEmail = 'createbookingexpert@mail.com';
  const customerEmail = 'createbookinguser@mail.com';
  let cookie: string, login, listing: ListingModelType, expert: ExpertModelType, user: UserModelType;
  const validBooking = { time: '2019-08-30T17:08:28.203Z' };

  beforeAll(async done => {
    await setTestingDbConnection();
    await registerCustomerUser(app, customerEmail);
    login = await loginCustomerUser(app, customerEmail);
    user = await getCustomerUserByEmail(customerEmail);
    cookie = getCookieFromHeader(login);
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
      const res = await postValidRequestWithCookie(app, URL, cookie, validBooking);
      expect(res.status).toBe(CREATED);
      const booking = await getBookingByCustomerId(user.id);
      expect(booking.expert.toString()).toEqual(expert.id.toString());
      expect(booking.listing.toString()).toEqual(listing.id.toString());
      await deleteBookingById(booking.id);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async done => {
      const res = await postValidRequestWithCookie(app, URL, 'wrong-cookie', validBooking);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 400 if the body of the request is not right', async done => {
      const res = await postValidRequestWithCookie(app, URL, cookie, { wrong: 'body' });
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return 404 if the listing doesnt exist', async done => {
      await deleteListingFromTestById(listing.id);
      const res = await postValidRequestWithCookie(app, URL, cookie, validBooking);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
