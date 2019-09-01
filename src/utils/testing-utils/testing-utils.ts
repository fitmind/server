import ListingModel from '../../api/listing/listing.model';
import BookingModel from '../../api/booking/booking.model';
import AdminModel, { AdminModelType } from '../../api/admin/admin.model';
import encryptPassword from '../encrypt-password/encrypt-password';
import CONFIG from '../../config/config';

export const userTestEmail = 'diego@testing.com';
export const userTestPassword = 'ValidPassword123!';
export const testingPictureUrl = 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png';

export const getCookieFromHeader = (login: any) => {
  return login.header['set-cookie'][0];
};

export const generateDateInThePast = (days: number): Date => {
  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  return pastDate;
};

export const generateDateInTheFuture = (days: number): Date => {
  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() + days);
  return pastDate;
};
