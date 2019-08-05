interface FilteredUserInterface {
  _id: string;
  name: string;
  email: string;
  description?: string;
  interestedInExpertiseAreas: string[];
  createdTimeStamp: string;
  approved: boolean;
  rating: number;
  __v: number;
}

export default FilteredUserInterface;
