import { testingPictureUrl, userTestEmail, userTestPassword } from './testing-utils';
import ExpertModel, { ExpertModelType } from '../../api/expert/expert.model';

export const generateExpertUserValidSignUp = (email = userTestEmail) => ({
  name: 'Diego Romero',
  email,
  description: 'some long string',
  password: userTestPassword,
  pictureUrl: testingPictureUrl,
  isAnExpertIn: ['PERSONAL_COACH'],
  weeklyAvailability: {
    monday: ['6:00', '6:30'],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  }
});

export const generateExpertValidLogin = (email = userTestEmail) => ({
  email,
  password: userTestPassword
});

export const deleteExpertByEmail = async (email: string) => {
  await ExpertModel.findOneAndDelete({ email });
};

export const generateExpertForTesting = async (email: string) => {
  return (await ExpertModel.create(generateExpertValidLogin(email))) as ExpertModelType;
};
