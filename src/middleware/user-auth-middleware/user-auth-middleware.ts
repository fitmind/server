import { NextFunction, Response } from 'express';
import CONFIG from '../../config/config';
import * as jwt from 'jsonwebtoken';
import HttpException from '../../utils/http-exception/http-exception';
import { UNAUTHORIZED, NOT_FOUND } from 'http-status-codes';
import jwtInterface from '../../interfaces/jwt.interface';
import UserModel from '../../api/user/user.model';
import RequestWithUser from '../../interfaces/request-with-user.interface';

async function userAuthMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  const token = cookies[CONFIG.cookies.user];
  if (!cookies || !token) {
    next(new HttpException(UNAUTHORIZED, 'Cookie is invalid'));
  } else {
    const secret = process.env.JWT_SECRET as string;
    try {
      const verificationResponse = jwt.verify(token, secret) as jwtInterface;
      const user = await UserModel.findById(verificationResponse.id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(new HttpException(NOT_FOUND, 'User does not exists'));
      }
    } catch (e) {
      next(new HttpException(UNAUTHORIZED, 'Failed to authenticate the response'));
    }
  }
}

export default userAuthMiddleware;
