import express from 'express';
import createApp from '../../../App';
import { includes } from 'ramda';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, OK, UNAUTHORIZED } from 'http-status-codes';
import CONFIG from '../../../config/config';
import {
  createAdmin,
  createApprovedExpert,
  deleteAdminByEmail,
  loginAdminUser
} from '../../../utils/testing-utils/admin-utils';
import { ExpertModelType } from '../../expert/expert.model';
import {
  deleteExpertByEmail,
  getExpertUserByMail,
  registerExpertUser
} from '../../../utils/testing-utils/expert-user-utils';
import { getCookieFromHeader, getValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Admin pending expert', () => {
  const URL = CONFIG.routes.admin.expertsPending;
  let app = createApp(express());
  const email = 'adminexpertpending@gmail.com';
  const expert1Email = 'expert1@gmail.com';
  const expert2Email = 'expert2@gmail.com';
  const approvedExpertEmail = 'approved@gmail.com';
  let cookie: string, login;

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email);
    await registerExpertUser(app, expert1Email);
    await registerExpertUser(app, expert2Email);
    login = await loginAdminUser(app, email);
    cookie = getCookieFromHeader(login);
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
      const approvedExpert = await createApprovedExpert(approvedExpertEmail);
      const expert1 = await getExpertUserByMail(expert1Email);
      const expert2 = await getExpertUserByMail(expert2Email);
      const res = await getValidRequestWithCookie(app, URL, cookie);
      expect(res.status).toEqual(OK);
      const ids = res.body.map((expert: ExpertModelType) => expert._id);
      expect(includes(expert1.id, ids)).toBeTruthy();
      expect(includes(expert2.id, ids)).toBeTruthy();
      expect(includes(approvedExpert.id, ids)).toBeFalsy();
      done();
    });
  });

  it('should return 401 if the authentication failed', async done => {
    const res = await getValidRequestWithCookie(app, URL, 'bad-cookie');
    expect(res.status).toBe(UNAUTHORIZED);
    done();
  });

  it('should return 404 if it was not possible to find the admin', async done => {
    await deleteAdminByEmail(email);
    const res = await getValidRequestWithCookie(app, URL, cookie);
    expect(res.status).toBe(NOT_FOUND);
    done();
  });
});
