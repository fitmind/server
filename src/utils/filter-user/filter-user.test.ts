import filterUser from './filter-user';
import { UserInterface } from '../../api/user/user.model';
import FilteredUserInterface from '../../interfaces/filtered-user';

describe('filter user function', () => {
  it('should return the user with only the filtered props', () => {
    const user: UserInterface = {
      interestedInExpertiseAreas: ['PERSONAL_COACH'],
      approved: false,
      rating: 0,
      _id: '5d47ddb0337912161dbbac54',
      name: 'Diego',
      email: 'diego@testing.com',
      description: 'some long string',
      password: '$2b$10$Vy1MhZz4T.HhCJ3v5viQwuu8YNSTAEAh/ncgRJM9n4.yYE8inxda2',
      createdTimeStamp: '2019-08-05T07:41:36.481Z',
      __v: 0
    };

    const filtered: FilteredUserInterface = {
      interestedInExpertiseAreas: ['PERSONAL_COACH'],
      approved: false,
      rating: 0,
      _id: '5d47ddb0337912161dbbac54',
      name: 'Diego',
      email: 'diego@testing.com',
      description: 'some long string',
      createdTimeStamp: '2019-08-05T07:41:36.481Z',
      __v: 0
    };
    expect(filterUser(user)).toEqual(filtered);
  });
});
