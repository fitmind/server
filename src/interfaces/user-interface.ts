export default interface UserInterface {
  id: string;
  name: string;
  email: string;
  description?: string;
  password: string;
  interestedInExpertiseAreas: string[];
  createdTimeStamp: string;
  __v: number;
  pictureUrl: string;
}
