export default interface UserInterface {
  _id: string;
  name: string;
  email: string;
  description?: string;
  password: string;
  interestedInExpertiseAreas: string[];
  createdTimeStamp: string;
  rating: number;
  __v: number;
  pictureUrl: string;
  bookings: string[];
}
