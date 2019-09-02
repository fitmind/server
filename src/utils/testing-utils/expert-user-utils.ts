import { testingPictureUrl, userTestEmail, userTestPassword } from './testing-utils';
import ExpertModel, { ExpertModelType } from '../../api/expert/expert.model';
import express from 'express';
import request from 'supertest';
import CONFIG from '../../config/config';

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

export const registerExpertUser = async (app: express.Application, email: string, customSignUp?: any) => {
  const validSignUp = customSignUp ? customSignUp : generateExpertUserValidSignUp(email);
  return request(app)
    .post(CONFIG.routes.expert.register)
    .send(validSignUp);
};

export const loginExpertUser = async (app: express.Application, email: string, customLogin?: any) => {
  const loginData = customLogin ? customLogin : generateExpertValidLogin(email);
  return request(app)
    .post(CONFIG.routes.expert.login)
    .send(loginData);
};

export const getExpertUserByMail = async (email: string) => {
  return (await ExpertModel.findOne({ email })) as ExpertModelType;
};

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
