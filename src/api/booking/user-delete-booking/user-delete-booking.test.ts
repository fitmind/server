import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, OK } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { ListingModelType } from '../../listing/listing.model';
import { UserModelType } from '../../user/user.model';
import { ExpertModelType } from '../../expert/expert.model';
import { BookingModelType } from '../booking.model';
import {
  deleteCustomerUserById,
  deleteCustomerUserFromDbByEmail,
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
import {
  deleteBookingById,
  generateBookingForTesting,
  getBookingById
} from '../../../utils/testing-utils/booking-utils';
import { deleteValidRequestWithCookie, getCookieFromHeader } from '../../../utils/testing-utils/testing-utils';

describe('Delete booking as a customer', () => {
  let URL: string;
  let app = createApp(express());
  const expertEmail = 'deleteBookingExpert@mail.com';
  const customerEmail = 'deleteBookingCustomer@mail.com';
  let cookie: string,
    login,
    listing: ListingModelType,
    expert: ExpertModelType,
    user: UserModelType,
    booking: BookingModelType;

  beforeAll(async done => {
    await setTestingDbConnection();
    await registerCustomerUser(app, customerEmail);
    login = await loginCustomerUser(app, customerEmail);
    user = await getCustomerUserByEmail(customerEmail);
    cookie = getCookieFromHeader(login);
    expert = await generateExpertForTesting(expertEmail);
    listing = await generateListingForTesting(expert.id);
    await approveListingInTesting(listing.id);
    booking = await generateBookingForTesting(user.id, listing.id, expert.id);
    URL = CONFIG.routes.bookings.deleteAsCustomerById(booking.id);
    console.log(URL);
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
      const res = await deleteValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toBe(OK);
      const deleted = await getBookingById(booking.id);
      expect(deleted).toBeNull();
      done();
    });
  });

  describe('invalid request', () => {
    it('should return 401 if the authentication failed', async done => {
      const res = await deleteValidRequestWithCookie(app, URL, 'wrong-cookie');
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 404 if the booking doesnt exist', async done => {
      const res = await deleteValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });

    it('should return 400 if another user is trying to delete the booking', async done => {
      booking = await generateBookingForTesting(user.id, listing.id, expert.id);
      URL = CONFIG.routes.bookings.deleteAsCustomerById(booking.id);

      const badCustomer = 'badcustomer@mail.com';
      await registerCustomerUser(app, badCustomer);
      const badLogin = await loginCustomerUser(app, badCustomer);
      const badCookie = getCookieFromHeader(badLogin);
      const res = await deleteValidRequestWithCookie(app, URL, badCookie);
      expect(res.status).toBe(BAD_REQUEST);
      await deleteCustomerUserFromDbByEmail(badCustomer);
      done();
    });
  });
});
