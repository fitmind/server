import UserModel from '../../api/user/user.model';

export const userTestEmail = 'diego@testing.com';
export const userTestPassword = 'ValidPassword123!';

export const userValidSignUp = (email = userTestEmail) => ({
  name: 'Diego',
  email,
  description: 'some long string',
  password: userTestPassword,
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  interestedInExpertiseAreas: ['PERSONAL_COACH']
});

export const userValidLogin = (email = userTestEmail) => ({
  email,
  password: userTestPassword
});

export const deleteFromDbByEmail = async (email: string) => {
  await UserModel.findOneAndDelete({ email });
};
