import FilteredUserInterface from '../../interfaces/filtered-user';
import { pick } from 'ramda';
import UserInterface from '../../interfaces/user-interface';

const filterUser = (user: UserInterface): FilteredUserInterface => {
  return pick(
    ['_id', 'email', 'name', 'description', 'interestedInExpertiseAreas', 'createdTimeStamp', 'pictureUrl'],
    user
  );
};

export default filterUser;
