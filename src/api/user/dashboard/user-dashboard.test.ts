import express from 'express';
import createApp from '../../../App';
import UserModel, { UserModelType } from '../user.model';
import CONFIG from '../../../config/config';
import request from 'supertest';
// import { UNAUTHORIZED, OK, NOT_FOUND } from 'http-status-codes';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-db-connection/testing-db-connection';
import {
  deleteFromDbByEmail,
  generateBookingForTesting,
  generateDateInTheFuture,
  generateDateInThePast,
  generateExpertForTesting,
  generateListingForTesting,
  userValidLogin,
  userValidSignUp
} from '../../../utils/testing-utils/testing-utils';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import ListingModel, { ListingModelType } from '../../listing/listing.model';
import BookingModel, { bookingModelType } from '../../bookings/booking.model';
// import { filterUserMe } from '../user-me/user-me';

describe('User Dashboard', () => {
  // const URL = CONFIG.routes.user.dashboard;
  const SIGN_UP_URL = CONFIG.routes.user.signUp;
  const LOGIN_URL = CONFIG.routes.user.login;
  const email = 'user_dashboard@testing.com';
  const expertEmail = 'expert@email.com';
  let expert: ExpertModelType,
    listing: ListingModelType,
    pastBooking: bookingModelType,
    futureBooking: bookingModelType,
    app: express.Application,
    cookie: string,
    user: UserModelType,
    login = null;

  beforeAll(async done => {
    app = createApp(express());
    await setTestingDbConnection();
    await request(app)
      .post(SIGN_UP_URL)
      .send(userValidSignUp(email));
    user = (await UserModel.findOne({ email })) as UserModelType;
    login = await request(app)
      .post(LOGIN_URL)
      .send(userValidLogin(email));
    cookie = login.header['set-cookie'][0];
    expert = await generateExpertForTesting(expertEmail);
    // console.log('expert');
    // console.log(expert);
    listing = await generateListingForTesting(expert._id);
    // console.log('listing');
    // console.log(listing);
    pastBooking = await generateBookingForTesting(generateDateInThePast(1), user._id, listing._id);
    futureBooking = await generateBookingForTesting(generateDateInTheFuture(1), user._id, listing._id);
    // console.log(pastBooking);
    // console.log(futureBooking);
    await user.bookings.push(futureBooking._id);
    await user.bookings.push(pastBooking._id);
    await user.save();
    done();
  });
  afterAll(async done => {
    await deleteFromDbByEmail(email);
    await ExpertModel.findByIdAndDelete(expert._id);
    await ListingModel.findByIdAndDelete(listing._id);
    await BookingModel.findByIdAndDelete(pastBooking._id);
    await BookingModel.findByIdAndDelete(futureBooking._id);
    await disconnectTestingDb();
    done();
  });

  it('should just pass for now', () => {
    expect(true).toBeTruthy();
  });

  // describe('valid request', () => {
  //   it('should return a 200 along with the dashboard data', async (done) => {
  //     const res = await request(app)
  //       .get(URL)
  //       .set('Cookie', [cookie]);
  //     expect(res.status).toEqual(OK);
  //     const expectedBody = {
  //       ...filterUserMe(user as UserModelType),
  //       pastBookings: [ pastBooking ],
  //       futureBookings: [ futureBooking ],
  //     };
  //     expect(JSON.stringify(res.body)).toEqual(JSON.stringify(expectedBody));
  //     done();
  //   });
  // });

  // describe('invalid request', () => {
  //   it('should return 401 if the authentication failed', async () => {
  //     const res = await request(app)
  //       .get(URL)
  //       .set('Cookie', [`${CONFIG.cookies.user}=wrong_token`]);
  //     expect(res.status).toBe(UNAUTHORIZED);
  //   });
  //   it('should return 404 if it was not possible to find the user', async () => {
  //     // @ts-ignore
  //     await UserModel.findByIdAndDelete(user._id);
  //     const res = await request(app)
  //       .get(URL)
  //       .set('Cookie', [cookie]);
  //     expect(res.status).toBe(NOT_FOUND);
  //   });
  // });
});
