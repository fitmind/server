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

export const deleteValidRequestWithCookie = async (app: express.Application, url: string, cookie: string) => {
  return request(app)
    .delete(url)
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

const monday = ['08:00', '09:00', '10:00'];
const tuesday = ['08:00', '07:00', '08:00', '09:00'];
const wednesday = ['06:00', '07:00', '08:00', '09:00'];
const thursday = ['08:00', '16:00', '17:00', '18:00', '19:00'];
const friday = ['08:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
const saturday = ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'];
const sunday = ['08:00'];
export const validWeeklyAvailability = {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
};
