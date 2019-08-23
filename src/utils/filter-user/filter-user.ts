import { pick } from 'ramda';
import UserInterface from '../../interfaces/user-interface';
import FilteredUserInterface from '../../interfaces/filtered-user';

const filterUser = (user: UserInterface): FilteredUserInterface => {
  return pick(
    [
      '_id',
      'email',
      'firstName',
      'lastName',
      'description',
      'interestedInExpertiseAreas',
      'createdTimeStamp',
      'pictureUrl'
    ],
    user
  );
};

export default filterUser;
