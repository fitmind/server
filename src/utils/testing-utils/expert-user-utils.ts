import { testingPictureUrl, userTestEmail, userTestPassword } from './testing-utils';
import ExpertModel, { ExpertModelType } from '../../api/expert/expert.model';
import express from 'express';
import request from 'supertest';
import CONFIG from '../../config/config';

const monday = ['08:00', '08:30', '09:00', '09:30', '10:00'];
const tuesday = ['07:00', '07:30', '08:00', '08:30', '09:00'];
const wednesday = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00'];
const thursday = [
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30'
];
const friday = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'];
const saturday = [
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00'
];
const sunday = ['00:30'];
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
