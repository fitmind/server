import { NextFunction, Request, Response } from 'express';
import { NOT_FOUND, UNAUTHORIZED, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import * as bcrypt from 'bcrypt';
import createUserToken from '../../../utils/create-token/create-token';
import CONFIG from '../../../config/config';
import ExpertModel from '../expert.model';

const expertLogin = async ({ body: { email, password } }: Request, res: Response, next: NextFunction) => {
  ExpertModel.findOne({ email }).then(async expert => {
    if (!expert) {
      next(new HttpException(NOT_FOUND, 'Email not found'));
    } else {
      const isPasswordMatching = await bcrypt.compare(password, expert.password);
      if (!isPasswordMatching) {
        next(new HttpException(UNAUTHORIZED, 'Passwords dont match'));
      } else {
        const token = createUserToken(expert._id);
        res.cookie(CONFIG.cookies.expert, token, {
          maxAge: CONFIG.authTokenExpiryDate,
          httpOnly: true
        });
        res.sendStatus(OK);
      }
    }
  });
};

export default expertLogin;
