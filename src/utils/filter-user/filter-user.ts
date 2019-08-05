import { UserInterface } from '../../api/user/user.model';
import FilteredUserInterface from '../../interfaces/filtered-user';
import { pick } from 'ramda';

const filterUser = (user: UserInterface): FilteredUserInterface => {
  return pick(
    [
      '_id',
      'email',
      'name',
      'description',
      'interestedInExpertiseAreas',
      'createdTimeStamp',
      'approved',
      'rating',
      '__v'
    ],
    user
  );
};

export default filterUser;
