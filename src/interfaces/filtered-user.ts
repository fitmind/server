interface FilteredUserInterface {
  _id: string;
  name: string;
  email: string;
  description?: string;
  interestedInExpertiseAreas: string[];
  createdTimeStamp: string;
  pictureUrl: string;
}

export default FilteredUserInterface;
