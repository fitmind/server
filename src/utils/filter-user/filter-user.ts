import { pick } from 'ramda';
import UserInterface from '../../interfaces/user-interface';
import FilteredUserInterface from '../../interfaces/filtered-user';

const filterUser = (user: UserInterface): FilteredUserInterface => {
  return pick(
    ['id', 'email', 'name', 'description', 'interestedInExpertiseAreas', 'createdTimeStamp', 'pictureUrl'],
    user
  );
};

export default filterUser;
