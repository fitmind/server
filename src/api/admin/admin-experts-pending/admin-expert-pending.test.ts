import express from 'express';
import createApp from '../../../App';
import { includes } from 'ramda';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import request from 'supertest';
import { NOT_FOUND, OK, UNAUTHORIZED } from 'http-status-codes';
import CONFIG, { ApprovedStatus } from '../../../config/config';
import { createAdmin, deleteAdminByEmail, generateAdminValidLogin } from '../../../utils/testing-utils/admin-utils';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import { deleteExpertByEmail, generateExpertUserValidSignUp } from '../../../utils/testing-utils/expert-user-utils';

describe('Admin pending expert', () => {
  const URL = CONFIG.routes.admin.expertsPending;
  let app = createApp(express());
  const email = 'adminexpertpending@gmail.com';
  const password = 'Testing123!';
  const expert1Email = 'expert1@gmail.com';
  const expert2Email = 'expert2@gmail.com';
  const approvedExpertEmail = 'approved@gmail.com';
  let cookie: string, login;
  const validLogin = generateAdminValidLogin(email, password);

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email, password);
    await request(app)
      .post(CONFIG.routes.expert.register)
      .send(generateExpertUserValidSignUp(expert1Email));
    await request(app)
      .post(CONFIG.routes.expert.register)
      .send(generateExpertUserValidSignUp(expert2Email));
    login = await request(app)
      .post(CONFIG.routes.admin.login)
      .send(validLogin);
    cookie = login.header['set-cookie'][0];
    done();
  });
  afterAll(async done => {
    await deleteExpertByEmail(expert1Email);
    await deleteExpertByEmail(expert2Email);
    await deleteExpertByEmail(approvedExpertEmail);
    await deleteAdminByEmail(email);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should allow the admin retrieve the experts in pending status', async done => {
      const approvedExpert = (await ExpertModel.create({
        email: approvedExpertEmail,
        approvedStatus: ApprovedStatus.APPROVED
      })) as ExpertModelType;
      const expert1 = (await ExpertModel.find({ email: expert1Email }))[0];
      const expert2 = (await ExpertModel.find({ email: expert2Email }))[0];
      const res = await request(app)
        .get(URL)
        .set('Cookie', [cookie]);
      expect(res.status).toEqual(OK);
      const ids = res.body.experts.map((expert: ExpertModelType) => expert._id);
      expect(includes(expert1.id, ids)).toBeTruthy();
      expect(includes(expert2.id, ids)).toBeTruthy();
      expect(includes(approvedExpert.id, ids)).toBeFalsy();
      done();
    });
  });

  it('should return 401 if the authentication failed', async done => {
    const res = await request(app)
      .get(URL)
      .set('Cookie', [`${CONFIG.cookies.admin}=wrong_token`]);
    expect(res.status).toBe(UNAUTHORIZED);
    done();
  });

  it('should return 404 if it was not possible to find the admin', async done => {
    await deleteAdminByEmail(email);
    const res = await request(app)
      .get(URL)
      .set('Cookie', [cookie]);
    expect(res.status).toBe(NOT_FOUND);
    done();
  });
});
