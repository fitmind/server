import AdminModel, { AdminModelType } from '../../api/admin/admin.model';
import encryptPassword from '../encrypt-password/encrypt-password';
import { userTestEmail, userTestPassword } from './testing-utils';
import express from 'express';
import request from 'supertest';
import CONFIG, { ApprovedStatus } from '../../config/config';
import ExpertModel, { ExpertModelType } from '../../api/expert/expert.model';

export const generateAdminValidLogin = (email: string = userTestEmail) => ({
  email,
  password: userTestPassword
});

export const createAdmin = async (email: string, password: string = userTestPassword): Promise<AdminModelType> => {
  const hashedPassword = await encryptPassword(password);
  return (await AdminModel.create({ email, password: hashedPassword })) as AdminModelType;
};

export const deleteAdminByEmail = async (email: string) => {
  await AdminModel.findOneAndDelete({ email });
};

export const loginAdminUser = async (app: express.Application, email: string, customLogin?: any) => {
  const loginData = customLogin ? customLogin : generateAdminValidLogin(email);
  return request(app)
    .post(CONFIG.routes.admin.login)
    .send(loginData);
};

export const createApprovedExpert = async (email: string) => {
  return (await ExpertModel.create({
    email,
    approvedStatus: ApprovedStatus.APPROVED
  })) as ExpertModelType;
};
