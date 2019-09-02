import express from 'express';
import createApp from '../../../App';
import {
  disconnectTestingDb,
  setTestingDbConnection
} from '../../../utils/testing-utils/testing-db-connection/testing-db-connection';
import { NOT_FOUND, OK, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import CONFIG from '../../../config/config';
import { createAdmin, deleteAdminByEmail, loginAdminUser } from '../../../utils/testing-utils/admin-utils';
import {
  deleteExpertByEmail,
  generateExpertForTesting,
  getExpertUserByMail
} from '../../../utils/testing-utils/expert-user-utils';
import { getCookieFromHeader, putValidRequestWithCookie } from '../../../utils/testing-utils/testing-utils';

describe('Admin expert approve', () => {
  let URL: string;
  let app = createApp(express());
  const email = 'adminexpertapprove@gmail.com';
  const expertEmail = 'expertadminapprove@mail.com';
  let cookie: string, login, expert;
  const validApproval = { approved: true };

  beforeAll(async done => {
    await setTestingDbConnection();
    await createAdmin(email);
    login = await loginAdminUser(app, email);
    cookie = getCookieFromHeader(login);
    expert = await generateExpertForTesting(expertEmail);
    URL = CONFIG.routes.admin.approveExpertId(expert.id);
    done();
  });
  afterAll(async done => {
    await deleteAdminByEmail(email);
    await deleteExpertByEmail(expertEmail);
    await disconnectTestingDb();
    done();
  });

  describe('valid request', () => {
    it('should change the expert approval status to APPROVED if is true', async done => {
      const res = await putValidRequestWithCookie(app, URL, cookie, validApproval);
      expect(res.status).toBe(OK);
      const expectedExpert = await getExpertUserByMail(expertEmail);
      expect(expectedExpert.approvedStatus).toEqual(CONFIG.ApprovedStatus.APPROVED);
      done();
    });
    it('should change the expert approval status to DENIED if false', async done => {
      const res = await putValidRequestWithCookie(app, URL, cookie, { approved: false });
      expect(res.status).toBe(OK);
      const expectedExpert = await getExpertUserByMail(expertEmail);
      expect(expectedExpert.approvedStatus).toEqual(CONFIG.ApprovedStatus.DENIED);
      done();
    });
  });

  describe('invalid request', () => {
    it('should return BAD REQUEST if the param is wrong', async done => {
      const badUrl = CONFIG.routes.admin.approveExpertId('badUrl');
      const res = await putValidRequestWithCookie(app, badUrl, cookie, validApproval);
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return NOT_FOUND if the user doesnt exist', async done => {
      const badUrl = CONFIG.routes.admin.approveExpertId('5d5e62f187f5450ade0c1xxx');
      const res = await putValidRequestWithCookie(app, badUrl, cookie, validApproval);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });

    it('should return 401 if the authentication failed', async done => {
      const res = await putValidRequestWithCookie(app, URL, 'wrong-cookie', validApproval);
      expect(res.status).toBe(UNAUTHORIZED);
      done();
    });

    it('should return 400 if the body of the request is not right', async done => {
      const res = await putValidRequestWithCookie(app, URL, cookie, { wrong: 'body' });
      expect(res.status).toBe(BAD_REQUEST);
      done();
    });

    it('should return 404 if it was not possible to find the admin', async done => {
      await deleteAdminByEmail(email);
      const res = await putValidRequestWithCookie(app, URL, cookie, validApproval);
      expect(res.status).toBe(NOT_FOUND);
      done();
    });
  });
});
