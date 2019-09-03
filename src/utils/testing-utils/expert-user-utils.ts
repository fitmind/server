import { testingPictureUrl, userTestEmail, userTestPassword } from './testing-utils';
import ExpertModel, { ExpertModelType } from '../../api/expert/expert.model';
import express from 'express';
import request from 'supertest';
import CONFIG from '../../config/config';

const monday = ['08:00', '09:00', '10:00'];
const tuesday = ['08:00', '07:00', '08:00', '09:00'];
const wednesday = ['06:00', '07:00', '08:00', '09:00'];
const thursday = ['08:00', '16:00', '17:00', '18:00', '19:00'];
const friday = ['08:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
const saturday = ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'];
const sunday = ['08:00'];
const weeklyAvailability = {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
};

export const generateExpertUserValidSignUp = (email = userTestEmail) => ({
  name: 'Diego Romero',
  email,
  description: 'some long string',
  password: userTestPassword,
  pictureUrl: testingPictureUrl,
  isAnExpertIn: ['PERSONAL_COACH'],
  weeklyAvailability
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
  return (await ExpertModel.create(generateExpertUserValidSignUp(email))) as ExpertModelType;
};
