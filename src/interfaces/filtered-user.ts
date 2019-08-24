interface FilteredUserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  interestedInExpertiseAreas: string[];
  createdTimeStamp: string;
  pictureUrl: string;
}

export default FilteredUserInterface;
