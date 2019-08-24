import weeklyAvailability from './weeklyAvailability.interface';

export default interface ExpertInterface {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  password: string;
  pictureUrl: string;
  createdTimeStamp: string;
  approvedStatus: string;
  isAnExpertIn: string[];
  bookings: string[];
  weeklyAvailability: weeklyAvailability;
}
