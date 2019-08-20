import filterUser from './filter-user';
import FilteredUserInterface from '../../interfaces/filtered-user';
import UserInterface from '../../interfaces/user-interface';

describe('filter user function', () => {
  it('should return the user with only the filtered props', () => {
    const user: UserInterface = {
      interestedInExpertiseAreas: ['PERSONAL_COACH'],
      rating: 0,
      _id: '5d47ddb0337912161dbbac54',
      pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
      name: 'Diego',
      email: 'diego@testing.com',
      description: 'some long string',
      password: '$2b$10$Vy1MhZz4T.HhCJ3v5viQwuu8YNSTAEAh/ncgRJM9n4.yYE8inxda2',
      createdTimeStamp: '2019-08-05T07:41:36.481Z',
      bookings: [],
      __v: 0
    };

    const filtered: FilteredUserInterface = {
      interestedInExpertiseAreas: ['PERSONAL_COACH'],
      _id: '5d47ddb0337912161dbbac54',
      pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
      name: 'Diego',
      email: 'diego@testing.com',
      description: 'some long string',
      createdTimeStamp: '2019-08-05T07:41:36.481Z'
    };
    expect(filterUser(user)).toEqual(filtered);
  });
});
