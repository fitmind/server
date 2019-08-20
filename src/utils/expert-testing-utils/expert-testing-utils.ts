import ExpertModel from '../../api/expert/expert.model';
import CONFIG from '../../config/config';

export const expertTestEmail = 'expert@testing.com';
export const expertTestPassword = 'ValidPassword123!';

export const expertValidSignUp = (email = expertTestEmail) => ({
  name: 'Diego',
  email,
  description: 'some long string',
  password: expertTestPassword,
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  isAnExpertIn: ['PERSONAL_COACH'],
  weeklyAvailability: {
    monday: ['6:00'],
    tuesday: ['6:00'],
    wednesday: ['6:00'],
    thursday: ['6:00'],
    friday: ['6:00'],
    saturday: ['6:00'],
    sunday: ['6:00']
  }
});

export const expertValidLogin = (email = expertTestEmail) => ({
  email,
  password: expertTestPassword
});

export const deleteExpertFromDbByEmail = async (email: string) => {
  await ExpertModel.findOneAndDelete({ email });
};
