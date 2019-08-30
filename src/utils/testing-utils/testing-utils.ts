import UserModel from '../../api/user/user.model';
import ExpertModel, { ExpertModelType } from '../../api/expert/expert.model';
import ListingModel from '../../api/listing/listing.model';
import BookingModel, { bookingModelType } from '../../api/booking/booking.model';
import AdminModel, { AdminModelType } from '../../api/admin/admin.model';
import encryptPassword from '../encrypt-password/encrypt-password';
import CONFIG from '../../config/config';

export const userTestEmail = 'diego@testing.com';
export const userTestPassword = 'ValidPassword123!';

export const deleteUserById = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};

export const userValidSignUp = (email = userTestEmail) => ({
  name: 'Diego',
  lastName: 'Romero',
  email,
  description: 'some long string',
  password: userTestPassword,
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  interestedInExpertiseAreas: ['PERSONAL_COACH']
});

export const generateExpertValidSignUp = (email = userTestEmail) => ({
  name: 'Diego Romero',
  email,
  description: 'some long string',
  password: userTestPassword,
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  isAnExpertIn: ['PERSONAL_COACH'],
  weeklyAvailability: {
    monday: ['6:00', '6:30'],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  }
});

export const generateListingValidBody = (expertId?: string, approvedStatus?: string) => ({
  name: 'listing name',
  price: '100.00',
  description: 'some listing desc',
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  expertiseArea: CONFIG.expertise.LIFE_COACH,
  postCode: 'NW13LR',
  createdByExpert: expertId,
  approvedStatus
});

export const generateListingForTesting = async (expertId?: string, approvedStatus?: string) => {
  return await ListingModel.create({ ...generateListingValidBody(expertId, approvedStatus) });
};

export const generateExpertLogin = (email = userTestEmail) => ({
  email,
  password: userTestPassword
});

export const userValidLogin = (email = userTestEmail) => ({
  email,
  password: userTestPassword
});

export const generateAdminValidLogin = (email: string = userTestEmail, password: string = userTestPassword) => ({
  email,
  password
});

export const deleteFromDbByEmail = async (email: string) => {
  await UserModel.findOneAndDelete({ email });
};

export const createAdmin = async (email: string, password: string): Promise<AdminModelType> => {
  const hashedPassword = await encryptPassword(password);
  return await AdminModel.create({ email, password: hashedPassword });
};

export const deleteAdminByEmail = async (email: string) => {
  await AdminModel.findOneAndDelete({ email });
};

export const deleteExpertByEmail = async (email: string) => {
  await ExpertModel.findOneAndDelete({ email });
};

export const deleteListingFromTestById = async (id: string) => {
  await ListingModel.findByIdAndDelete(id);
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

export const generateExpertForTesting = async (email: string) => {
  return (await ExpertModel.create(generateExpertValidSignUp(email))) as ExpertModelType;
};

export const generateBookingForTesting = async (date: Date, userId: string, listingId: string) => {
  return (await BookingModel.create({
    time: date,
    createdByUser: userId,
    listing: listingId
  })) as bookingModelType;
};
