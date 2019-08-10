import { NextFunction, Response } from 'express';
import CONFIG, { UserTypes } from '../../config/config';
import * as jwt from 'jsonwebtoken';
import HttpException from '../../utils/http-exception/http-exception';
import { UNAUTHORIZED, NOT_FOUND } from 'http-status-codes';
import jwtInterface from '../../interfaces/jwt.interface';
import UserModel from '../../api/user/user.model';
import RequestWithUser from '../../interfaces/request-with-user.interface';

function userAuthMiddleware(type: UserTypes) {
  let cookieType: string;
  // will need to extend this model once the other types of user are implemented: let model = UserModel | ExpertModel | AdminModel;
  let model = UserModel;
  switch (type) {
    case UserTypes.CUSTOMER:
      cookieType = CONFIG.cookies.user;
      break;
    case UserTypes.EXPERT:
      cookieType = CONFIG.cookies.expert;
      // once we have experts model should be different
      break;
    case UserTypes.ADMIN:
      cookieType = CONFIG.cookies.admin;
      // once we have experts model should be different
      break;
  }
  return async function(req: RequestWithUser, res: Response, next: NextFunction) {
    const cookies = req.cookies;
    const token = cookies[cookieType];
    if (!cookies || !token) {
      next(new HttpException(UNAUTHORIZED, 'Cookie is invalid'));
    } else {
      const secret = process.env.JWT_SECRET as string;
      try {
        const verificationResponse = jwt.verify(token, secret) as jwtInterface;
        const user = await model.findById(verificationResponse.id);
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
  };
}

export default userAuthMiddleware;
