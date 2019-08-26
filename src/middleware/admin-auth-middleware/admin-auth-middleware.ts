import { NextFunction, Response } from 'express';
import CONFIG from '../../config/config';
import * as jwt from 'jsonwebtoken';
import HttpException from '../../utils/http-exception/http-exception';
import { UNAUTHORIZED, NOT_FOUND } from 'http-status-codes';
import jwtInterface from '../../interfaces/jwt.interface';
import AdminModel from '../../api/admin/admin.model';
import RequestWithAdminInterface from '../../interfaces/request-with-admin.interface';

async function adminAuthMiddleware(req: RequestWithAdminInterface, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  const token = cookies[CONFIG.cookies.admin];
  if (!cookies || !token) {
    next(new HttpException(UNAUTHORIZED, 'Cookie is invalid'));
  } else {
    const secret = process.env.JWT_SECRET as string;
    try {
      const verificationResponse = jwt.verify(token, secret) as jwtInterface;
      const admin = await AdminModel.findById(verificationResponse.id);
      if (admin) {
        req.admin = admin;
        next();
      } else {
        next(new HttpException(NOT_FOUND, 'User does not exists'));
      }
    } catch (e) {
      next(new HttpException(UNAUTHORIZED, 'Failed to authenticate the response'));
    }
  }
}

export default adminAuthMiddleware;
