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
import { deleteCustomerUserById, generateUserForTesting } from '../../../utils/testing-utils/customer-user-utils';
import {
  getExpertUserByMail,
  loginExpertUser,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';
import { deleteListingFromTestById, generateListingForTesting } from '../../../utils/testing-utils/listing-utils';
import {
  deleteBookingById,
  generateBookingForTesting,
  generateDateYesterday
} from '../../../utils/testing-utils/booking-utils';
import { ExpertModelType } from '../expert.model';
import { ListingModelType } from '../../listing/listing.model';
import { BookingModelType } from '../../booking/booking.model';
import { UserModelType } from '../../user/user.model';

const URL = CONFIG.routes.expert.dashboard;

describe('expert dashboard', () => {
  let app: express.Application = createApp(express());
  const userEmail = 'userexpertdashboard@gmail.com';
  const expertEmail = 'experexperttdashboard@gmail.com';
  let login,
    cookie: string,
    expert: ExpertModelType,
    listing: ListingModelType,
    pastBooking: BookingModelType,
    futureBooking: BookingModelType,
    user: UserModelType;

  beforeAll(async done => {
    await setTestingDbConnection();
    await registerExpertUser(app, expertEmail);
    login = await loginExpertUser(app, expertEmail);
    cookie = getCookieFromHeader(login);
    expert = await getExpertUserByMail(expertEmail);
    user = await generateUserForTesting(userEmail);
    listing = await generateListingForTesting(expert.id, CONFIG.ApprovedStatus.APPROVED);
    pastBooking = await generateBookingForTesting(user.id, listing.id, expert.id, generateDateYesterday());
    futureBooking = await generateBookingForTesting(user.id, listing.id, expert.id);
    done();
  });

  afterAll(async done => {
    await deleteCustomerUserById(user.id);
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
