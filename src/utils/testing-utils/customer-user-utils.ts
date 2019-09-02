import express from 'express';
import request from 'supertest';
import CONFIG from '../../config/config';
import UserModel, { UserModelType } from '../../api/user/user.model';
import { testingPictureUrl, userTestPassword } from './testing-utils';

export const generateCustomerUserValidSignUp = (email: string) => ({
  name: 'Diego',
  lastName: 'Romero',
  email,
  description: 'some long string',
  password: userTestPassword,
  pictureUrl: testingPictureUrl,
  interestedInExpertiseAreas: ['PERSONAL_COACH']
});

export const registerCustomerUser = async (app: express.Application, email: string, customSignUp?: any) => {
  const validSignUp = customSignUp ? customSignUp : generateCustomerUserValidSignUp(email);
  return request(app)
    .post(CONFIG.routes.user.signUp)
    .send(validSignUp);
};

export const generateUserForTesting = async (email: string) => {
  return (await UserModel.create(generateCustomerUserValidSignUp(email))) as UserModelType;
};

export const deleteCustomerUserFromDbByEmail = async (email: string) => {
  await UserModel.findOneAndDelete({ email });
};

export const deleteCustomerUserById = async (id: string) => {
  await UserModel.findByIdAndDelete(id);
};

export const getCustomerUserByEmail = async (email: string) => {
  return (await UserModel.findOne({ email })) as UserModelType;
};

export const generateCustomerUserValidLogin = (email: string) => ({
  email,
  password: userTestPassword
});

export const loginCustomerUser = async (
  app: express.Application,
  email: string,
  customLogin?: { email: string; password: string }
) => {
  const loginData = customLogin ? customLogin : generateCustomerUserValidLogin(email);
  return request(app)
    .post(CONFIG.routes.user.login)
    .send(loginData);
};
