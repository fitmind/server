import request from 'supertest';
import CONFIG from '../../config/config';
import express from 'express';
import ExpertModel from '../../api/expert/expert.model';

export const userTestEmail = 'diego@testing.com';
export const userTestPassword = 'ValidPassword123!';
export const testingPictureUrl = 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png';

export const getCookieFromHeader = (login: any) => {
  return login.header['set-cookie'][0];
};

export const generateDateInThePast = (days: number): Date => {
  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  return pastDate;
};

export const generateDateInTheFuture = (days: number): Date => {
  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() + days);
  return pastDate;
};

export const requestWithWrongCookie = async (app: express.Application, url: string) => {
  return request(app)
    .get(url)
    .set('Cookie', [`${CONFIG.cookies.user}=wrong_token`]);
};

export const getValidRequestWithCookie = async (app: express.Application, url: string, cookie: string) => {
  return request(app)
    .get(url)
    .set('Cookie', [cookie]);
};

export const postValidRequestWithCookie = async (app: express.Application, url: string, cookie: string, data: any) => {
  return request(app)
    .post(url)
    .set('Cookie', [cookie])
    .send(data);
};

export const postValidRequest = async (app: express.Application, url: string, data: any) => {
  return request(app)
    .post(url)
    .send(data);
};

export const postValidRequestWithoutData = async (app: express.Application, url: string, cookie: string) => {
  return request(app)
    .post(url)
    .set('Cookie', [cookie]);
};

export const putValidRequestWithCookie = async (app: express.Application, url: string, cookie: string, data: any) => {
  return request(app)
    .put(url)
    .set('Cookie', [cookie])
    .send(data);
};

export const deleteExpertById = async (id: string) => {
  await ExpertModel.findByIdAndDelete(id);
};
