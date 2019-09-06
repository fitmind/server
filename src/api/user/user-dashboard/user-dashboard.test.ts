import express from 'express';
import createApp from '../../../App';
import CONFIG from '../../../config/config';
import { OK, UNAUTHORIZED } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import {
  deleteExpertById,
  getCookieFromHeader,
  getValidRequestWithCookie
} from '../../../utils/testing-utils/testing-utils';
import {
  deleteCustomerUserFromDbByEmail,
  getCustomerUserByEmail,
  loginCustomerUser,
  registerCustomerUser
} from '../../../utils/testing-utils/customer-user-utils';
import { generateExpertForTesting } from '../../../utils/testing-utils/expert-user-utils';
import { deleteListingFromTestById, generateListingForTesting } from '../../../utils/testing-utils/listing-utils';
import {
  deleteBookingById,
  generateBookingForTesting,
  generateDateYesterday
} from '../../../utils/testing-utils/booking-utils';
import { ExpertModelType } from '../../expert/expert.model';
import { ListingModelType } from '../../listing/listing.model';
import { BookingModelType } from '../../booking/booking.model';

const URL = CONFIG.routes.user.dashboard;

describe('User dashboard', () => {
  let app: express.Application = createApp(express());
  const email = 'userdashboard@gmail.com';
  const expertEmail = 'expertdashboard@gmail.com';
  let login,
    cookie: string,
    expert: ExpertModelType,
    listing: ListingModelType,
    pastBooking: BookingModelType,
    futureBooking: BookingModelType;

  beforeAll(async done => {
    await setTestingDbConnection();
    await registerCustomerUser(app, email);
    login = await loginCustomerUser(app, email);
    cookie = getCookieFromHeader(login);
    const user = await getCustomerUserByEmail(email);
    expert = await generateExpertForTesting(expertEmail);
    listing = await generateListingForTesting(expert.id, CONFIG.ApprovedStatus.APPROVED);
    pastBooking = await generateBookingForTesting(user.id, listing.id, expert.id, generateDateYesterday());
    futureBooking = await generateBookingForTesting(user.id, listing.id, expert.id);
    done();
  });

  afterAll(async done => {
    await deleteCustomerUserFromDbByEmail(email);
    await deleteExpertById(expert.id);
    await deleteListingFromTestById(listing.id);
    await deleteBookingById(pastBooking.id);
    await deleteBookingById(futureBooking.id);
    await disconnectTestingDb();
    done();
  });

  describe('user dashboard', () => {
    describe('valid request', () => {
      it('should return a list with the future and past bookings', async done => {
        const res = await getValidRequestWithCookie(app, URL, cookie);
        expect(res.status).toEqual(OK);
        expect(res.body.pastBookings).toHaveLength(1);
        expect(res.body.futureBookings).toHaveLength(1);
        done();
      });
    });
    describe('invalid data', () => {
      it('should fail if the cookie is not in the request', async done => {
        const res = await getValidRequestWithCookie(app, URL, 'bad-cookie');
        expect(res.status).toEqual(UNAUTHORIZED);
        done();
      });
    });
  });
});
