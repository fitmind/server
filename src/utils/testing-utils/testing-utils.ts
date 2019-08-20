import UserModel from '../../api/user/user.model';
import ExpertModel, { ExpertModelType } from '../../api/expert/expert.model';
import { expertValidSignUp } from '../expert-testing-utils/expert-testing-utils';
import ListingModel from '../../api/listing/listing.model';
import BookingModel, { bookingModelType } from '../../api/bookings/booking.model';

export const userTestEmail = 'diego@testing.com';
export const userTestPassword = 'ValidPassword123!';

export const userValidSignUp = (email = userTestEmail) => ({
  name: 'Diego',
  email,
  description: 'some long string',
  password: userTestPassword,
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  interestedInExpertiseAreas: ['PERSONAL_COACH']
});

export const userValidLogin = (email = userTestEmail) => ({
  email,
  password: userTestPassword
});

export const deleteFromDbByEmail = async (email: string) => {
  await UserModel.findOneAndDelete({ email });
};

export const generateDateInThePast = (days: number): Date => {
  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  return pastDate;
};

export const ListingCreationData = (expertId: string) => ({
  name: 'Listing name',
  description: 'some long string',
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  expertiseArea: 'PERSONAL_COACH',
  createdByExpert: expertId
});

export const generateDateInTheFuture = (days: number): Date => {
  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() + days);
  return pastDate;
};

export const generateExpertForTesting = async (email: string) => {
  return (await ExpertModel.create(expertValidSignUp(email))) as ExpertModelType;
};

export const generateListingForTesting = async (expertId: string) => {
  return await ListingModel.create(ListingCreationData(expertId));
};

export const generateBookingForTesting = async (date: Date, userId: string, listingId: string) => {
  return (await BookingModel.create({
    time: date,
    createdByUser: userId,
    listing: listingId
  })) as bookingModelType;
};
